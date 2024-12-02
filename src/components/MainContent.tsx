import SiteTitle from './SiteTitle';
import { Filters } from './Filters';
import NotePopup from './NotePopup';
import { GameGrid } from './GameGrid';
import Settings from './Settings';
import { PlayStatus } from '~/types';
import AddGames from './AddGames';
import useAppStore from '~/store';

export default function MainContent() {
    const games = useAppStore((state) => state.games);
    if (!games.length)
        return (
            <main className="my-auto w-full h-full justify-center flex flex-col items-center gap-8 text-center">
                <SiteTitle />
                <p>
                    Ever feel overwhelmed by the hundreds of free games in your
                    Epic library? <br />
                    This site is for you.
                </p>
                <AddGames />
            </main>
        );

    return (
        <main className="flex flex-col gap-8">
            <SiteTitle />
            <div className="flex items-center gap-4 sticky top-0 z-20 bg-white py-4">
                <div className="bg-white h-[3.75rem] absolute top-0 -left-4 -right-4 -z-[1]" />
                <Filters />
                <Settings className="ml-auto" />
            </div>
            <NotePopup>
                <GameGrid playStatus={PlayStatus.Playing} />
                <GameGrid playStatus={PlayStatus.WantToPlay} />
                <GameGrid playStatus={PlayStatus.NotStarted} />
                <GameGrid playStatus={PlayStatus.Finished} />
                <GameGrid playStatus={PlayStatus.Abandoned} />
                <GameGrid playStatus={PlayStatus.NotInterested} />
            </NotePopup>
        </main>
    );
}
