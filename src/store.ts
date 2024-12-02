import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Filter,
    Game,
    GameMetadata,
    PlayStatus,
    SavedMetadata,
    SortedGames,
} from './types';
import { cleanGamesList } from './utils';
import { DEFAULT_GAMES_METADATA, DEFAULT_PLAY_STATUS } from './constants';

const sortAllGames = (games: Game[], gamesMetadata: SavedMetadata) => {
    const sortedGames: SortedGames = {
        [PlayStatus.NotStarted]: [] as Game[],
        [PlayStatus.WantToPlay]: [] as Game[],
        [PlayStatus.Playing]: [] as Game[],
        [PlayStatus.Finished]: [] as Game[],
        [PlayStatus.Abandoned]: [] as Game[],
        [PlayStatus.NotInterested]: [] as Game[],
    };
    games.forEach((game) => {
        const { playStatus = DEFAULT_PLAY_STATUS } =
            gamesMetadata[game.slug] || {};
        sortedGames[playStatus].push(game);
    });

    return sortedGames;
};

interface BearState {
    games: Game[];
    clearGames: () => void;
    sortedGames: SortedGames;
    setSortedGames: (games: SortedGames) => void;
    gamesMetadata: SavedMetadata;

    addGames: (games: Game[]) => {
        cleanedGames: Game[];
        verifiedNewGames: Game[];
    };
    deleteGame: (slug: string) => void;
    updateMetadata: (slug: string, metadata: Partial<GameMetadata>) => void;
    setGamePlayStatus: (slug: string, status: PlayStatus) => void;

    selectedGame: Game | null;
    setSelectedGame: (game: Game | null) => void;

    filter: Filter;
    updateFilter: (filter: Partial<Filter>) => void;
}

const useAppStore = create<BearState>()(
    persist(
        (set, get) => {
            return {
                games: [] as Game[],
                clearGames: () => {
                    set({ games: [], sortedGames: DEFAULT_GAMES_METADATA });
                },
                sortedGames: DEFAULT_GAMES_METADATA,
                setSortedGames: (games) => {
                    set({ sortedGames: games });
                },
                gamesMetadata: {},
                setGamePlayStatus: (slug: string, status: PlayStatus) => {
                    const { updateMetadata, gamesMetadata, sortedGames } =
                        get();
                    const oldStatus =
                        gamesMetadata[slug]?.playStatus || DEFAULT_PLAY_STATUS;
                    if (oldStatus === status) return;

                    updateMetadata(slug, {
                        playStatus: status,
                        statusTimes: {
                            ...(gamesMetadata[slug]?.statusTimes || {}),
                            [status]: Date.now(),
                        },
                    });

                    const oldInd = sortedGames[oldStatus].findIndex(
                        (game) => game.slug === slug
                    );
                    if (oldInd > -1) {
                        const game = sortedGames[oldStatus][oldInd];
                        sortedGames[oldStatus].splice(oldInd, 1);
                        sortedGames[status].push(game);
                        sortedGames[status].sort((a, b) =>
                            a.name.localeCompare(b.name)
                        );
                    }
                    set({
                        sortedGames: JSON.parse(JSON.stringify(sortedGames)),
                    });
                },

                addGames: (newGames: Game[]) => {
                    const { games, sortedGames, gamesMetadata } = get();
                    const { cleanedGames, verifiedNewGames } = cleanGamesList(
                        JSON.parse(JSON.stringify(games)),
                        newGames
                    );

                    if (verifiedNewGames.length) {
                        verifiedNewGames.forEach((game) => {
                            const { playStatus = DEFAULT_PLAY_STATUS } =
                                gamesMetadata[game.slug] || {};
                            sortedGames[playStatus].push(game);
                        });

                        Object.values(sortedGames).forEach((games) => {
                            games.sort((a, b) => a.name.localeCompare(b.name));
                        });

                        set({
                            games: cleanedGames,
                            sortedGames: JSON.parse(
                                JSON.stringify(sortedGames)
                            ),
                        });
                    }

                    return {
                        cleanedGames,
                        verifiedNewGames,
                    };
                },
                updateMetadata: (slug: string, metadata: GameMetadata) => {
                    set((state) => ({
                        gamesMetadata: {
                            ...state.gamesMetadata,
                            [slug]: {
                                ...(state.gamesMetadata[slug] || {}),
                                ...metadata,
                            },
                        },
                    }));
                },
                deleteGame: (slug: string) => {
                    set((state) => {
                        const { games, sortedGames, gamesMetadata } = state;
                        const ind = games.findIndex(
                            (game) => game.slug === slug
                        );
                        if (ind > -1) {
                            const game = games[ind];
                            const { playStatus = DEFAULT_PLAY_STATUS } =
                                gamesMetadata[game.slug] || {};
                            games.splice(ind, 1);

                            const sortedInd = sortedGames[playStatus].findIndex(
                                (game) => game.slug === slug
                            );
                            if (sortedInd > -1) {
                                sortedGames[playStatus].splice(sortedInd, 1);
                            }
                        }

                        return {
                            games,
                            sortedGames: JSON.parse(
                                JSON.stringify(sortedGames)
                            ),
                        };
                    });
                },

                selectedGame: null,
                setSelectedGame: (game: Game | null) => {
                    set({ selectedGame: game });
                },

                filter: {
                    search: '',
                    platform: null,
                    storefront: null,
                },
                updateFilter: (filter) => {
                    set((state) => ({
                        filter: {
                            ...state.filter,
                            ...filter,
                        },
                    }));
                },
            };
        },
        {
            name: 'backlog-tracker',
            partialize: (state) => ({
                games: state.games,
                gamesMetadata: state.gamesMetadata,
                filter: state.filter,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    const { games = [], gamesMetadata, setSortedGames } = state;
                    if (games?.length) {
                        const sortedGames = sortAllGames(games, gamesMetadata);
                        setSortedGames(sortedGames);
                    }
                }
            },
        }
    )
);

export default useAppStore;
