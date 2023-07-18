import { Sliders } from './sliders/sliders';
import { Links } from './links/links';
import { CTA } from './cta/cta';
import { Games } from './games/games';

export interface MainProps {
    isLoggedIn?: boolean;
}

export const Main = ({ isLoggedIn }: MainProps) => {
    return (
        <main>
            {!isLoggedIn && <CTA />}
            <Sliders />
            <Links />
            <Games />
        </main>
    );
};
