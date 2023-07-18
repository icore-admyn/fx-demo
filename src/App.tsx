import { useEffect, useState } from 'react';
import { Nav } from './components/nav/nav';
import { Main } from './components/main/main';
import { Footer } from './components/footer/footer';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import { Account } from './components/account/account';
import { Deposit } from './components/deposit/deposit';
import { Checkout } from './components/checkout/checkout';
import globalStyles from './css/global.module.scss'
import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mainBalance, setMainBalance] = useState(0);
    const [bonusBalance, setBonusBalance] = useState(0);
    const [loginPopUp, setLoginPopUp] = useState(false);
    const [signUpPopUp, setSignUpPopUp] = useState(false);
    const [accountPopUp, setAccountPopUp] = useState(false);
    const [depositPopUp, setDepositPopUp] = useState(false);
    const [checkoutPopUp, setCheckoutPopUp] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');
    const [userSettings, setUserSettings] = useState({});
    const totalBalance = mainBalance + bonusBalance;

    // Check if user has login token
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(token !== null);

        if (token) {
            axios.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setUserSettings(response.data.user);
                    setMainBalance(response.data.user.mainBalance);
                    setBonusBalance(response.data.user.bonusBalance);
                })
                .catch(error => {
                    console.error(error);
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                });
        }
    }, [isLoggedIn]);

    // Disable scroll on popup
    useEffect(() => {
        const body = document.body.classList
        if (loginPopUp || signUpPopUp || accountPopUp || depositPopUp || checkoutPopUp) {
            body.add(globalStyles.disableScroll);
        } else {
            body.remove(globalStyles.disableScroll);
        }
    }, [loginPopUp, signUpPopUp, accountPopUp, depositPopUp, checkoutPopUp]);

    return (
        <>
            <Nav
                isLoggedIn={isLoggedIn}
                totalBalance={totalBalance}
                setLoginPopUp={setLoginPopUp}
                setSignUpPopUp={setSignUpPopUp}
                setAccountPopUp={setAccountPopUp}
                setDepositPopUp={setDepositPopUp}
            />
            <Main isLoggedIn={isLoggedIn} />
            {
                !isLoggedIn && loginPopUp &&
                <Login
                    setSignUpPopUp={setSignUpPopUp}
                    setLoginPopUp={setLoginPopUp}
                    setIsLoggedIn={setIsLoggedIn}
                />
            }
            {
                !isLoggedIn && signUpPopUp &&
                <SignUp
                    setSignUpPopUp={setSignUpPopUp}
                    setLoginPopUp={setLoginPopUp}
                    setIsLoggedIn={setIsLoggedIn}
                />
            }
            {
                isLoggedIn && accountPopUp &&
                <Account
                    setDepositPopUp={setDepositPopUp}
                    setAccountPopUp={setAccountPopUp}
                    userSettings={userSettings}
                    setUserSettings={setUserSettings}
                    setIsLoggedIn={setIsLoggedIn}
                />
            }
            {
                isLoggedIn && depositPopUp &&
                <Deposit
                    setDepositPopUp={setDepositPopUp}
                    setCheckoutPopUp={setCheckoutPopUp}
                    setPaymentUrl={setPaymentUrl}
                />
            }
            {
                isLoggedIn && checkoutPopUp &&
                <Checkout
                    setCheckoutPopUp={setCheckoutPopUp}
                    url={paymentUrl}
                />
            }
            <Footer />
        </>
    );
}

export default App;
