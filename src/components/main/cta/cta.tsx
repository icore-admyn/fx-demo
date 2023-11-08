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
                    <p className={styles.subText}>Start Trading Today!</p>
                    <h2 className={styles.heading}>Join now!</h2>
                    <h3 className={styles.subHeading}>Start with $5</h3>
                    <p className={styles.description}>
                        Increase Your Trading Power by up to 1.5 times and 
                        withdraw your profits anytime.
                        Get an additional 10% Credit Deposit Bonus for all your subsequent deposits!
                    </p>
                    <button>Claim Now!</button>
                </div>
            </div>
        </section>
    );
};
