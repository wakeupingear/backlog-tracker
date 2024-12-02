import { SITE_NAME } from '~/constants';
import useAppStore from '~/store';
import { pluralize } from '~/utils';

export default function SiteTitle() {
    const games = useAppStore((state) => state.games);
    if (!games.length) return <h1 className="main-header-text">{SITE_NAME}</h1>;

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl italic">{SITE_NAME}</h1>
            <h2 className="main-header-text">
                You have {games.length} {pluralize('option', games.length)}!
            </h2>
        </div>
    );
}
