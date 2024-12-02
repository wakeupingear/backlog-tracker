import React, { useMemo, useTransition } from 'react';
import { Input } from '~/components/ui/input';
import { Platform, Storefront } from '~/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import useAppStore from '~/store';
import { STOREFRONT_METADATA } from '~/constants';

export const Filters: React.FC = () => {
    const [isPending, startTransition] = useTransition();

    const filter = useAppStore((state) => state.filter);
    const updateFilter = useAppStore((state) => state.updateFilter);
    const games = useAppStore((state) => state.games);

    const platforms = useMemo(
        () =>
            Array.from(
                new Set(
                    games.flatMap((game) => game.sources.map((p) => p.platform))
                )
            ),
        [games]
    );

    const storefronts = useMemo(
        () =>
            Array.from(
                new Set(
                    games.flatMap((game) =>
                        game.sources.map((p) => p.storefront)
                    )
                )
            ),
        [games]
    );

    return (
        <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1 max-w-lg">
                <Input
                    type="text"
                    placeholder="Search games..."
                    value={filter.search}
                    onChange={(e) => {
                        const value = e.target.value;
                        startTransition(() => {
                            updateFilter({ search: value });
                        });
                    }}
                    className={isPending ? 'opacity-70' : ''}
                />
            </div>

            <Select
                value={filter.platform || 'none'}
                onValueChange={(platform) => {
                    startTransition(() => {
                        updateFilter({
                            platform: (platform === 'none'
                                ? null
                                : platform) as Platform | null,
                        });
                    });
                }}
            >
                <SelectTrigger className="w-fit">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">All Platforms</SelectItem>
                    {platforms.map((p) => (
                        <SelectItem key={p} value={p}>
                            {p}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filter.storefront || 'none'}
                onValueChange={(storefront) => {
                    startTransition(() => {
                        updateFilter({
                            storefront: (storefront === 'none'
                                ? null
                                : storefront) as Storefront | null,
                        });
                    });
                }}
            >
                <SelectTrigger className="w-fit">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">All Storefronts</SelectItem>
                    {storefronts.map((p) => {
                        const { title, Icon } = STOREFRONT_METADATA[p];
                        return (
                            <SelectItem key={p} value={p}>
                                <Icon size={16} className="inline" /> {title}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};
