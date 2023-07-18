import classNames from 'classnames';
import styles from './sliders.module.scss';
import globalStyles from '../../../css/global.module.scss';
export interface SlidersProps {
    className?: string;
}

export const Sliders = ({ className }: SlidersProps) => {
    return (
        <section className={classNames(styles.root, className)}>
            <div className={styles.sliderWrapper}>
                <div className={styles.largerSlider}>
                    <div className={styles.sliderHeaderWrapper}>
                        <p className={styles.sliderDate}>1 - 14 Febuary</p>
                        <h3 className={styles.sliderHeading}>Valetines Wins</h3>
                    </div>
                    <div className={styles.sliderContent}>
                        <p className={styles.sliderText}>
                            <span>Prize Pool </span>
                            <span className={styles.prizeMoney}>$5,000</span>
                        </p>
                    </div>
                    <button
                        className={classNames(
                            globalStyles.buttonSmall,
                            globalStyles.secondaryButton
                        )}
                    >
                        Join Now!
                    </button>
                </div>
                <div className={styles.smallSlider}>
                    <div className={styles.sliderContent}>
                        <p className={styles.sliderDate}>First deposit bonus:</p>
                        <h3 className={styles.sliderHeading}>
                            <span className={styles.sliderSpanTop}>Get up to</span>
                            <span>500 free spins</span>
                            <span className={styles.sliderSpanBottom}>
                                when you deposit up to $50
                            </span>
                        </h3>
                    </div>
                    <button
                        className={classNames(
                            globalStyles.buttonSmall,
                            globalStyles.secondaryButton
                        )}
                    >
                        Claim Now!
                    </button>
                </div>
            </div>
        </section>
    );
};
