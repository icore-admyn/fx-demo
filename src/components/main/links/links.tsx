import classNames from 'classnames';
import styles from './links.module.scss';
import PokerImg from '../../../assets/svgs/poker.svg';
import CasinoImg from '../../../assets/svgs/casino.svg';
import SportsbookImg from '../../../assets/svgs/sportsbook.svg';
import EsportsImg from '../../../assets/svgs/esports.svg';
import VirtualImg from '../../../assets/svgs/virtual.svg';
import TournameentImg from '../../../assets/svgs/tournaments.svg';

export interface LinkProps {
    className?: string;
    title: string;
    src: string;
}

export interface PageLinksProps {
    className?: string;
}

export const Link = ({ className, title, src }: LinkProps) => {
    return (
        <button className={styles.linkButton}>
            <img src={src} alt={title} className={styles.linkIcon} />
            <h3 className={styles.linkText}>{title}</h3>
        </button>
    );
};

export const Links = ({ className }: PageLinksProps) => {
    return (
        <section className={classNames(styles.root, className)}>
            <div className={styles.linksWrapper}>
                <Link title="Poker" src={PokerImg} />
                <Link title="Casino" src={CasinoImg} />
                <Link title="Sportsbook" src={SportsbookImg} />
                <Link title="Esports" src={EsportsImg} />
                <Link title="Virtual" src={VirtualImg} />
                <Link title="Tournaments" src={TournameentImg} />
            </div>
        </section>
    );
};
