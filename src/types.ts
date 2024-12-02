export enum Platform {
    Mac = 'Mac',
    Windows = 'Windows',
    Linux = 'Linux',
    Android = 'Android',
    IOS = 'IOS',
    Switch = 'Switch',
    Xbox = 'Xbox',
    Playstation = 'Playstation',
    Stadia = 'Stadia',
    Nintendo = 'Nintendo',
}

export enum Storefront {
    Amazon = 'nile',
    Epic = 'legendary',
    GOG = 'gog',
    Steam = 'steam',
}

export interface GameSource {
    platform: Platform;
    storefront: Storefront;
    url: string | null;
}

export interface Game {
    slug: string;
    name: string;
    sources: GameSource[];
    art_background: string | null;
    art_cover: string | null;
    art_square: string | null;
    releaseDate?: string;
}

export enum PlayStatus {
    NotStarted = 'Not Started',
    WantToPlay = 'Want to Play',
    Playing = 'Playing',
    Finished = 'Finished',
    NotInterested = 'Not Interested',
    Abandoned = 'Abandoned',
}

export interface HeroicGame {
    app_name: string;
    art_cover: string;
    art_square: string;
    canRunOffline: boolean;
    cloud_save_enabled: boolean;
    developer: string;
    folder_name: string;
    is_installed: boolean;
    is_mac_native?: boolean;
    is_linux_native?: boolean;
    isEAManaged?: boolean;
    runner: Storefront;
    title: string;
    install: {
        is_dlc: boolean;
        executable?: string;
        install_path?: string;
        install_size?: string;
        version?: string;
        platform?: Platform;
    };
    extra?: {
        about: {
            description: string;
            shortDescription: string;
        };
        reqs: string[];
        storeUrl: string;
        genres: string[];
    };
    art_background?: string | null;
    art_icon?: string | null;
    save_path?: string | null;
    save_folder?: string | null;
    store_url?: string | null;
    namespace?: string;
}

export interface HeroicFile {
    library?: HeroicGame[];
    games?: HeroicGame[];
}

export interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    has_community_visible_stats: boolean;
    playtime_windows_forever: number;
    playtime_mac_forever: number;
    playtime_linux_forever: number;
    playtime_deck_forever: number;
    rtime_last_played: number;
    has_leaderboards: boolean;
    playtime_disconnected: number;
}

export interface GameMetadata {
    isFavorite?: boolean;
    playStatus?: PlayStatus;
    message?: string;
    statusTimes?: Partial<Record<PlayStatus, number>>;
}

export type SavedMetadata = Record<string, GameMetadata>;

export type SortedGames = Record<PlayStatus, Game[]>;

export interface Filter {
    search: string;
    platform: Platform | null;
    storefront: Storefront | null;
}
