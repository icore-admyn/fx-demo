import { CTA } from './cta/cta';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { MarketOverview } from "react-ts-tradingview-widgets";
import { Screener, CopyrightStyles } from "react-ts-tradingview-widgets";

const copyrightStyles: CopyrightStyles = {
    parent: {
        display: 'none'
    },
}

export interface MainProps {
    isLoggedIn?: boolean;
}

export const Main = ({ isLoggedIn }: MainProps) => {
    return (
        <main>
            {!isLoggedIn ? <CTA /> :
                <div style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr',
                        gap: '20px'
                }}>
                        <AdvancedRealTimeChart theme="dark" autosize copyrightStyles={copyrightStyles}></AdvancedRealTimeChart>
                        <MarketOverview colorTheme="dark" height={600} width="100%" showFloatingTooltip copyrightStyles={copyrightStyles}></MarketOverview>
                    </div>
                    <Screener colorTheme="dark" width="100%" height={500} copyrightStyles={copyrightStyles}></Screener>
                </div>}
        </main>
    );
};
