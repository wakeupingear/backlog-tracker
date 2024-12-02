import React, { useMemo } from 'react';
import { PlayStatus } from '../types';
import useAppStore from '~/store';
import { GAME_ASPECT_RATIO, PLAY_STATUS_METADATA } from '~/constants';
import { slugify } from '~/utils';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import GameCard from './GameCard';
import { useWindowSize } from 'usehooks-ts';

const GAP = 16;
const MIN_COLUMN_WIDTH = 180; // Minimum width for each column
const MAX_COLUMN_COUNT = 12;

export interface GameGridProps {
    playStatus: PlayStatus;
}

export const GameGrid: React.FC<GameGridProps> = ({ playStatus }) => {
    const filter = useAppStore((state) => state.filter);
    const _games = useAppStore((state) => state.sortedGames)[playStatus];
    const games = useMemo(() => {
        let games = _games;
        if (filter.search)
            games = games.filter((game) =>
                game.name.toLowerCase().includes(filter.search.toLowerCase())
            );
        if (filter.platform)
            games = games.filter((game) =>
                game.sources.some((s) => s.platform === filter.platform)
            );
        if (filter.storefront)
            games = games.filter((game) =>
                game.sources.some((s) => s.storefront === filter.storefront)
            );

        return games;
    }, [filter, _games]);

    const { width: _width } = useWindowSize();
    const width = _width - 32;
    const gridRef = React.useRef<HTMLDivElement | null>(null);

    const columnCount = Math.min(
        Math.max(1, Math.floor((width - GAP) / (MIN_COLUMN_WIDTH + GAP))),
        MAX_COLUMN_COUNT
    );
    const columnWidth =
        Math.floor((width - GAP * (columnCount + 2)) / columnCount) + 1;
    const columnHeight = Math.floor(columnWidth / GAME_ASPECT_RATIO) + 16;
    const rowVirtualizer = useWindowVirtualizer({
        count: Math.ceil(games.length / columnCount),
        estimateSize: () => columnHeight,
        overscan: columnCount * 3,
        scrollMargin: gridRef.current?.offsetTop ?? 0,
    });

    if (!games.length) return null;

    const virtualRows = rowVirtualizer.getVirtualItems();
    const title = PLAY_STATUS_METADATA[playStatus].title;

    return (
        <section className="flex flex-col gap-0 relative" id={slugify(title)}>
            <div className="text-xl font-bold sticky top-14 z-10">
                <div className="bg-white h-[3.75rem] absolute top-0 -left-4 -right-4 -z-[1]" />
                <h2 className="w-full bg-white py-4 mb-2">
                    {title} ({games.length})
                </h2>
            </div>
            <div
                className="p-4 relative w-full"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                }}
                ref={gridRef}
            >
                {virtualRows.map((virtualRow) => {
                    const rowStart = virtualRow.index * columnCount;
                    return (
                        <div
                            key={virtualRow.key}
                            className="absolute top-0 left-0 w-full"
                            style={{
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${
                                    virtualRow.start -
                                    rowVirtualizer.options.scrollMargin
                                }px)`,
                            }}
                        >
                            <div
                                className="grid w-full h-full gap-4"
                                style={{
                                    gridTemplateColumns: `repeat(${columnCount}, ${columnWidth}px)`,
                                }}
                            >
                                {Array.from({ length: columnCount }).map(
                                    (_, colIndex) => {
                                        const gameIndex = rowStart + colIndex;
                                        const game = games[gameIndex];
                                        const key = game?.slug || colIndex;

                                        return (
                                            <div key={key}>
                                                {game && (
                                                    <GameCard game={game} />
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
