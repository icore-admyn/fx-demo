import styles from './nav.module.scss';
import globalStyles from '../../css/global.module.scss';
import Logo from '../../assets/svgs/logo.svg';
import User from '../../assets/svgs/user.svg'
import Currency from '../../assets/svgs/dollar.svg'
import Classnames from 'classnames';
import { useState } from 'react';

interface NavProps {
    isLoggedIn?: boolean;
    totalBalance: number;
    setLoginPopUp: (value: boolean) => void;
    setSignUpPopUp: (value: boolean) => void;
    setAccountPopUp: (value: boolean) => void;
    setDepositPopUp: (value: boolean) => void;
}

export const Nav: React.FC<NavProps> = ({
    isLoggedIn,
    totalBalance,
    setLoginPopUp,
    setSignUpPopUp,
    setAccountPopUp,
    setDepositPopUp
}) => {

    function HandleSignUp() {
        setSignUpPopUp(true);
    }

    function HandleLogin() {
        setLoginPopUp(true);
    }

    function HandleAccounts() {
        setAccountPopUp(true);
    }

    function HandleDeposit() {
        setDepositPopUp(true);
    }


    return (
        <nav role="navigation" className={styles.nav}>
            <a href="https://icorepay.io" className={styles.logoWrapper}>
                <img src={Logo} alt="iCore Logo" className={styles.logo} />
            </a>
            <ul className={styles.menu}>
                <li className={styles.navLink}>Casino</li>
                <li className={styles.navLink}>Poker</li>
                <li className={styles.navLink}>Sportsbook</li>
                <li className={styles.navLink}>eSports</li>
                <li className={styles.navLink}>Virtual</li>
                <li className={styles.navLink}>Tournaments</li>
            </ul>
            {isLoggedIn ? (
                <div className={styles.loggedInWrapper}>
                    <div className={styles.balanceWrapper}>
                        <div className={styles.balance}>
                            <span>Balance: </span>
                            <strong>${totalBalance}</strong>
                        </div>
                        <img
                            src={Currency}
                            loading="lazy"
                            alt=""
                            className={Classnames(
                                globalStyles.icon,
                                styles.currencyIcon,
                            )}
                        />
                    </div>
                    <div className={styles.buttonWrapper}>
                        <button
                            className={Classnames(
                                globalStyles.buttonWithIcon,
                                globalStyles.buttonSmall,
                                globalStyles.secondaryButton
                            )}
                            onClick={HandleAccounts}
                        >
                            <img
                                src={User}
                                loading="lazy"
                                alt=""
                                className={Classnames(
                                    globalStyles.icon,
                                    styles.buttonIcon,
                                )}
                            />
                            <div>Account</div>
                        </button>
                        <button
                            className={globalStyles.buttonSmall}
                            onClick={HandleDeposit}
                        >
                            Deposit
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.buttonWrapper}>
                    <button
                        className={Classnames(
                            globalStyles.buttonSmall,
                            globalStyles.secondaryButton
                        )}
                        onClick={HandleLogin}
                    >
                        Log In
                    </button>
                    <button
                        className={globalStyles.buttonSmall}
                        onClick={HandleSignUp}
                    >
                        Sign Up
                    </button>
                </div>
            )}
        </nav>
    );
};
