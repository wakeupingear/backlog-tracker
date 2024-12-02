import { IconType } from 'react-icons';
import { Game, PlayStatus, SortedGames, Storefront } from './types';
import { SiAmazon, SiEpicgames, SiGogdotcom, SiSteam } from 'react-icons/si';

export const IGNORED_GAME_NAMES = ['Galaxy Common Redistributables'];

export const SITE_NAME = 'What Do I Play Next?';

export const STEAM_API_KEY = import.meta.env.VITE_STEAM_API_KEY;

export const DEFAULT_PLAY_STATUS = PlayStatus.NotStarted;

export const PLAY_STATUS_METADATA: Record<
    PlayStatus,
    {
        title: string;
    }
> = {
    [PlayStatus.NotStarted]: {
        title: 'Not Started',
    },
    [PlayStatus.WantToPlay]: {
        title: 'Want to Play',
    },
    [PlayStatus.Playing]: {
        title: 'Playing',
    },
    [PlayStatus.Finished]: {
        title: 'Finished!',
    },
    [PlayStatus.Abandoned]: {
        title: 'Abandoned',
    },
    [PlayStatus.NotInterested]: {
        title: 'Not Interested',
    },
};

export const STOREFRONT_METADATA: Record<
    Storefront,
    {
        title: string;
        Icon: IconType;
        defaultURL: string;
    }
> = {
    [Storefront.Amazon]: {
        title: 'Amazon',
        Icon: SiAmazon,
        defaultURL: 'https://gaming.amazon.com/home',
    },
    [Storefront.Epic]: {
        title: 'Epic',
        Icon: SiEpicgames,
        defaultURL: 'com.epicgames.launcher://apps',
    },
    [Storefront.GOG]: {
        title: 'GOG',
        Icon: SiGogdotcom,
        defaultURL: 'https://gog.com/account',
    },
    [Storefront.Steam]: {
        title: 'Steam',
        Icon: SiSteam,
        defaultURL: 'steam://url/LauncherHomePage/',
    },
};

export const GAME_ASPECT_RATIO = 3 / 4;

export const DEFAULT_GAMES_METADATA: SortedGames = {
    [PlayStatus.NotStarted]: [] as Game[],
    [PlayStatus.WantToPlay]: [] as Game[],
    [PlayStatus.Playing]: [] as Game[],
    [PlayStatus.Finished]: [] as Game[],
    [PlayStatus.Abandoned]: [] as Game[],
    [PlayStatus.NotInterested]: [] as Game[],
};
