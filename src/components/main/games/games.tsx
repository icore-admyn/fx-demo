import classNames from 'classnames';
import styles from './games.module.scss';
import { gameData } from './gamedata';
import Favourite from '../../../assets/svgs/heart.svg';

export interface Game {
    id: number;
    title: string;
    src: string;
    isNew: boolean;
}

export interface Games {
    className?: string;
}

export const Game = ({ id, title, src, isNew }: Game) => {
    return (
        <div id={id.toString()} className={styles.gameWrapper}>
            {isNew && <div>NEW</div>}
            <img src={src} loading="lazy" alt={title} className={styles.gameImg} />
            <div>
                <img src={Favourite} loading="lazy" alt="Favourite" />
                <div>
                    <button>Play Game</button>
                </div>
                <h3>{title}</h3>
            </div>
        </div>
    );
};

export const Games = ({ className }: Games) => {
    return (
        <section className={classNames(styles.root, className)}>
            <h2>Featured Games</h2>
            <div className={styles.allGames}>
                {gameData.map((game) => {
                    return <Game id={game.id} title={game.title} src={game.src} isNew={game.isNew} />;
                })}
            </div>
        </section>
    );
};
