import clsx from 'clsx';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { SettingsIcon } from 'lucide-react';
import useAppStore from '~/store';
import AddGames from './AddGames';

type Props = {
    className?: string;
};

export default function Settings({ className }: Props) {
    const clearGames = useAppStore((state) => state.clearGames);

    return (
        <div className={clsx('flex gap-4', className)}>
            <AddGames />
            <Popover>
                <PopoverTrigger>
                    <Button variant="outline">
                        <SettingsIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-4">
                    <Button onClick={clearGames}>Delete All Games</Button>
                </PopoverContent>
            </Popover>
        </div>
    );
}
