import classNames from 'classnames';
import styles from './footer.module.scss';
import Logo from '../../assets/svgs/logo.svg';

export interface FooterProps {
    className?: string;
}

export const Footer = ({ className }: FooterProps) => {
    return (
        <footer className={classNames(styles.root, className)}>
            <div className={styles.footerTop}>
                <img src={Logo} loading="lazy" alt="iCore Logo" className={styles.logo} />
                <div>
                    <h3 className={styles.footerHeading}>About</h3>
                    <ul role="list" className={styles.footerList}>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Terms &amp; Conditions
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Responsible Gaming
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Privacy Policy
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className={styles.footerHeading}>Help</h3>
                    <ul role="list" className={styles.footerList}>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className={styles.footerHeading}>Products</h3>
                    <ul role="list" className={styles.footerList}>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Poker
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Casino
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Sportsbook
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                E-Sports
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Virtual
                            </a>
                        </li>
                        <li>
                            <a href="#" className={styles.footerLink}>
                                Tournaments
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <span>
                    <strong>iCore Pay</strong> is not a real casino
                </span>
                <br />
                <br />
                Copyright © 2020 iCore Pay. All rights reserved.
            </div>
        </footer>
    );
};
