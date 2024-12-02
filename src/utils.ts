import {
    Game,
    GameSource,
    HeroicFile,
    Platform,
    PlayStatus,
    SteamGame,
    Storefront,
} from './types';
import { IGNORED_GAME_NAMES, STEAM_API_KEY } from './constants';

export const parseHeroicConfig = (configFile: HeroicFile): Game[] => {
    const library = configFile.library || configFile.games;
    if (!library) return [];

    return library
        .filter(({ title }) => !IGNORED_GAME_NAMES.includes(title))
        .map((game) => {
            const name = game.title || game.app_name || 'Unknown Game';
            const sources: GameSource[] = [
                {
                    platform: Platform.Windows,
                    storefront: game.runner,
                    url: game?.extra?.storeUrl || null,
                },
            ];
            if (game.is_mac_native)
                sources.push({
                    ...sources[0],
                    platform: Platform.Mac,
                });
            if (game.is_linux_native)
                sources.push({
                    ...sources[0],
                    platform: Platform.Linux,
                });

            return {
                slug: slugify(name),
                isFavorite: false,
                name,
                sources,
                playStatus: PlayStatus.NotStarted,
                art_background: game.art_background || null,
                art_cover: game.art_cover || null,
                art_square: game.art_square || null,
            };
        });
};

export const fetchSteamGames = async (steamID: string) => {
    const res = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamID}&format=json&include_appinfo=true`
    );
    if (!res.ok) {
        throw new Error('Failed to fetch Steam games');
    }

    const data = (await res.json()) as SteamGame[];

    return data.map(
        (game) =>
            ({
                slug: slugify(game.name),
                isFavorite: false,
                name: game.name,
                sources: [
                    {
                        platform: Platform.Windows,
                        storefront: Storefront.Steam,
                        url: `https://store.steampowered.com/app/${game.appid}`,
                    },
                ],
                playStatus: PlayStatus.NotStarted,
                art_background: game.img_icon_url,
                art_cover: game.img_icon_url,
                art_square: game.img_icon_url,
            } as Game)
    );
};

export const cleanGamesList = (targetList: Game[], newGames: Game[]) => {
    const visitedMap = new Map<string, number>();
    const duplicateGames = new Set<number>();
    const verifiedNewGames: Game[] = [];
    let cleanedGames = [...targetList, ...newGames].reduce((acc, game, i) => {
        if (visitedMap.has(game.name)) {
            const ind = visitedMap.get(game.name) ?? -1;
            duplicateGames.add(ind);
            if (!isNaN(ind)) acc[ind].sources.push(...game.sources);

            return acc;
        }

        visitedMap.set(game.name, acc.length);
        acc.push(game);
        if (i >= targetList.length) verifiedNewGames.push(game);

        return acc;
    }, [] as Game[]);

    for (const i of duplicateGames) {
        const game = cleanedGames[i];
        cleanedGames[i].sources = Array.from(new Set(game.sources));
    }

    cleanedGames = cleanedGames.sort((a, b) => a.name.localeCompare(b.name));

    return {
        cleanedGames,
        verifiedNewGames,
    };
};

export const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '');

export const pluralize = (text: string, count: number): string =>
    count === 1 ? text : `${text}s`;
