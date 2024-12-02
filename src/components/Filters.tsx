import React from 'react';
import { Input } from '~/components/ui/input';
import { Platform } from '~/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';

interface FiltersProps {
    searchTerm: string;
    platform: Platform | null;
    onSearchChange: (term: string) => void;
    onPlatformChange: (platform: Platform) => void;
    platforms: Platform[];
}

export const Filters: React.FC<FiltersProps> = ({
    searchTerm,
    platform,
    onSearchChange,
    onPlatformChange,
    platforms,
}) => {
    if (!platforms.length) return null;

    return (
        <div className="flex items-center gap-4 w-full">
            <Input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 max-w-lg"
            />
            <Select value={platform || ''} onValueChange={onPlatformChange}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                    {platforms.map((p) => (
                        <SelectItem key={p} value={p}>
                            {p}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
