import { Game, PlayStatus } from '~/types';
import {
    Heart,
    MessageSquareDashed,
    MessageSquareText,
    Trash,
} from 'lucide-react';
import useAppStore from '~/store';
import { Card, CardContent } from './ui/card';
import clsx from 'clsx';
import { Badge } from './ui/badge';
import { useToast } from '~/hooks/use-toast';
import { ToastAction } from './ui/toast';
import {
    GAME_ASPECT_RATIO,
    PLAY_STATUS_METADATA,
    STOREFRONT_METADATA,
} from '~/constants';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from './ui/context-menu';

type Props = {
    game: Game;
};

export default function GameCard({ game }: Props) {
    const { slug, art_square, sources } = game;
    const coverUrl = art_square;
    const hasImage = Boolean(coverUrl);

    const { toast } = useToast();
    const deleteGame = useAppStore((state) => state.deleteGame);
    const updateMetadata = useAppStore((state) => state.updateMetadata);
    const setGamePlayStatus = useAppStore((state) => state.setGamePlayStatus);
    const setSelectedGame = useAppStore((state) => state.setSelectedGame);
    const gamesMetadata = useAppStore((state) => state.gamesMetadata);
    const { isFavorite, playStatus, message } = gamesMetadata[slug] || {};

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card
                    id={`game-${slug}`}
                    className="text-white flex flex-col justify-between relative border-black border-2 overflow-hidden group hover:shadow-lg hover:scale-105 transition-all duration-100"
                    style={{
                        aspectRatio: GAME_ASPECT_RATIO,
                    }}
                    onDoubleClick={() =>
                        updateMetadata(slug, { isFavorite: !isFavorite })
                    }
                >
                    {coverUrl && (
                        <>
                            <img
                                loading="lazy"
                                src={coverUrl}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                        </>
                    )}
                    <div className="flex items-center absolute -top-1 -right-1 bg-white rounded-bl-xl border-2 border-black text-black child:px-[6px] child:py-[6px]">
                        <button onClick={() => setSelectedGame(game)}>
                            {message ? (
                                <MessageSquareText size={20} />
                            ) : (
                                <MessageSquareDashed size={20} />
                            )}
                        </button>
                        <button
                            onClick={() =>
                                updateMetadata(slug, {
                                    isFavorite: !isFavorite,
                                })
                            }
                        >
                            <Heart
                                className={clsx({
                                    'fill-red-500 text-red-500': isFavorite,
                                })}
                                size={20}
                            />
                        </button>
                    </div>
                    <CardContent
                        className={clsx(
                            'z-[5] mt-auto flex flex-col gap-4 p-3',
                            {
                                'opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all':
                                    hasImage,
                            }
                        )}
                    >
                        <div className="flex flex-wrap gap-2">
                            {sources.map(
                                ({ platform, url: _url, storefront }) => {
                                    const { Icon, title, defaultURL } =
                                        STOREFRONT_METADATA[storefront];
                                    const url = _url || defaultURL;
                                    const content = (
                                        <Badge
                                            key={`${platform}-${storefront}`}
                                            variant="secondary"
                                            className="cursor-pointer gap-1 select-auto"
                                        >
                                            <Icon size={12} />
                                            {platform || title}
                                        </Badge>
                                    );

                                    if (url)
                                        return (
                                            <a
                                                target="_blank"
                                                href={url}
                                                rel="noreferrer"
                                            >
                                                {content}
                                            </a>
                                        );
                                    return content;
                                }
                            )}
                        </div>
                        <h3 className="font-semibold">{game.name}</h3>
                        <select
                            value={playStatus}
                            onChange={(e) => {
                                const status = e.target.value as PlayStatus;
                                setGamePlayStatus(slug, status);
                                const title = `Moved game to ${PLAY_STATUS_METADATA[status].title}!`;
                                if (
                                    status === PlayStatus.Finished ||
                                    status === PlayStatus.Abandoned
                                )
                                    toast({
                                        title:
                                            status === PlayStatus.Finished
                                                ? 'Game Finished!'
                                                : title,
                                        description: `Want to write a note about it?`,
                                        action: (
                                            <ToastAction
                                                altText="Add Journal Entry"
                                                onClick={() => {
                                                    setSelectedGame(game);
                                                }}
                                            >
                                                Add Note
                                            </ToastAction>
                                        ),
                                    });
                                else toast({ title });
                            }}
                            className="w-full p-2 rounded border text-black"
                        >
                            {Object.values(PlayStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    className="text-red-500 gap-1"
                    onClick={() => deleteGame(game.slug)}
                >
                    <Trash size={16} /> Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
