import classNames from 'classnames';
import styles from './cta.module.scss';

export interface SignUpCTAProps {
    className?: string;
}

export const CTA = ({ className }: SignUpCTAProps) => {
    return (
        <section className={classNames(styles.root, className)}>
            <div className={styles.ctaWrapper}>
                <div className={styles.cta}>
                    <p className={styles.subText}>Welcome to our casino!</p>
                    <h2 className={styles.heading}>Join now!</h2>
                    <h3 className={styles.subHeading}>Claim your bonus $50</h3>
                    <p className={styles.description}>
                        Sign up and deposit $20 to unlock an incredible $50 bonus, giving you a
                        total of $70 to play with. With our vast selection of games and thrilling
                        rewards, the possibilities are endless. Don't miss out on this fantastic
                        opportunity to boost your chances of winning big.
                    </p>
                    <button>Claim Now!</button>
                </div>
            </div>
        </section>
    );
};
