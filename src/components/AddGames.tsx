import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { useState } from 'react';
import { Label } from './ui/label';
import { toast } from '~/hooks/use-toast';
import useAppStore from '~/store';
import { fetchSteamGames, parseHeroicConfig } from '~/utils';
import { Game } from '~/types';

const onError = () =>
    toast({
        title: 'Failed to fetch games',
        description: 'Please try again later.',
        variant: 'destructive',
    });

export default function AddGames() {
    const [steamID, setSteamID] = useState('');
    const [open, setOpen] = useState(false);

    const _addGames = useAppStore((state) => state.addGames);
    const addGames = async (games: Game[]) => {
        const { cleanedGames, verifiedNewGames } = _addGames(games);
        if (!verifiedNewGames.length) toast({ title: 'No new games found!' });
        else
            toast({
                title: `Added ${verifiedNewGames.length} games!`,
                description: `You now have ${cleanedGames.length} games!`,
            });

        setOpen(false);
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (!files) return;

        const newGames: Game[] = [];
        for (const file of files) {
            const text = await file.text();
            const config = JSON.parse(text);
            const parsedGames = parseHeroicConfig(config);
            newGames.push(...parsedGames);
        }

        addGames(newGames);
    };

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <Button>Add Games</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add Games</DialogTitle>
                <DialogDescription>
                    We support a few different sources for games.
                </DialogDescription>
                <h3>Steam</h3>
                <ol className="list-decimal list-inside">
                    <li>
                        Click on your profile picture in the top right corner
                    </li>
                    <li>
                        Select <strong>Account Details</strong>.
                    </li>
                    <li>
                        Your <strong>Steam ID</strong> can be found below your
                        Steam username.
                    </li>
                </ol>

                <div className="flex items-end gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="steamID">Steam ID</Label>
                        <Input
                            id="steamID"
                            placeholder="Steam ID"
                            value={steamID}
                            onChange={(e) => setSteamID(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={async () => {
                            try {
                                addGames(await fetchSteamGames(steamID));
                            } catch (e: unknown) {
                                console.error(e);
                                onError();
                            }
                        }}
                        disabled={!steamID}
                    >
                        Add Games
                    </Button>
                </div>
                <Separator />
                <h3>Epic, GOG, and Amazon</h3>
                <p>
                    We don't have a native integration for these stores, but you
                    can use the free{' '}
                    <a
                        href="https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Heroic Games Launcher
                    </a>{' '}
                    to add them.
                    <br /> Once installed, you can directly upload their library
                    files to this site.
                </p>
                <Button className="relative">
                    Import Library Files
                    <input
                        type="file"
                        multiple
                        accept=".json"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </Button>
            </DialogContent>
        </Dialog>
    );
}
