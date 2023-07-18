import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import plobalStyles from '../../css/global.module.scss';
import styles from './sign-up.module.scss';
import axios from 'axios';

export interface SignUpProps {
    setSignUpPopUp: (value: boolean) => void;
    setLoginPopUp: (value: boolean) => void;
    setIsLoggedIn: (value: boolean) => void;
}

export const SignUp = ({ setSignUpPopUp, setLoginPopUp, setIsLoggedIn }: SignUpProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        walletAddress: '',
        relayUrl: 'test.icorepay.io/v1',
        JWTkey: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const formRefs = [
        useRef<HTMLFormElement>(null),
        useRef<HTMLFormElement>(null),
        useRef<HTMLFormElement>(null),
    ];

    function handlePopUp() {
        setSignUpPopUp(false);
    }

    function handleLogin() {
        setSignUpPopUp(false);
        setLoginPopUp(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const nextStep = () => {
        const currentForm = formRefs[step - 1].current;
        if (currentForm && currentForm.checkValidity()) {
            if (step === 1 && formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            setStep((prevStep) => prevStep + 1);
        } else {
            currentForm?.reportValidity();
        }
    };

    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/register', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            handlePopUp();
        } catch (error) {
            console.error(error);
        }
    };


    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form ref={formRefs[0]}>
                        <div>
                            <h3>Step 1: Account Information</h3>
                            <div className={plobalStyles.inputWrapper}>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className={plobalStyles.inputWrapper}>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <div className={plobalStyles.inputWrapper}>
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                            <div className={styles.buttonWrapper}>
                                <div></div>
                                <button
                                    className={plobalStyles.buttonSmall}
                                    onClick={nextStep}
                                    type="button"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <form ref={formRefs[1]}>
                        <div>
                            <h3>Step 2: Relay Information</h3>
                            <p>
                                <strong>Note: </strong>The relay address, wallet address, and key
                                are handled by the merchant. This is ONLY FOR DEMO FUNCTIONALITY; a
                                user would not be expected to provide this information.
                            </p>
                            <p>Don't have a wallet? Create one here: <a className={plobalStyles.link} href='https://wallet.badger.cash/' target='_'>https://wallet.badger.cash/</a></p>
                            <div className={plobalStyles.inputWrapper}>
                                <label>Wallet Address</label>
                                <input
                                    type="text"
                                    name="walletAddress"
                                    value={formData.walletAddress}
                                    onChange={handleChange}
                                    placeholder="Wallet Address"
                                    required
                                />
                            </div>
                            <div className={plobalStyles.inputWrapper}>
                                <label>Realy URL:</label>
                                <input
                                    type="text"
                                    name="relayUrl"
                                    value={formData.relayUrl}
                                    onChange={handleChange}
                                    placeholder="Relay URL"
                                    required
                                />
                            </div>
                            <div className={plobalStyles.inputWrapper}>
                                <label>
                                    Key <em>(Optional)</em>:
                                </label>
                                <input
                                    type="text"
                                    name="JWTkey"
                                    value={formData.JWTkey}
                                    onChange={handleChange}
                                    placeholder="Key"
                                />
                            </div>
                            <div className={styles.buttonWrapper}>
                                <button
                                    className={classNames(
                                        plobalStyles.buttonSmall,
                                        plobalStyles.secondaryButton
                                    )}
                                    onClick={prevStep}
                                    type="button"
                                >
                                    Previous
                                </button>
                                <button
                                    className={plobalStyles.buttonSmall}
                                    onClick={nextStep}
                                    type="button"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                );
            case 3:
                return (
                    <form ref={formRefs[2]} onSubmit={handleSubmit}>
                        <div>
                            <h3>Step 3: Confirmation</h3>
                            <p>Email: {formData.email}</p>
                            <p>Wallet: {formData.walletAddress}</p>
                            <p>Relay: {formData.relayUrl}</p>
                            <p>Key: {formData.JWTkey}</p>
                            <div className={styles.buttonWrapper}>
                                <button
                                    onClick={prevStep}
                                    className={classNames(
                                        plobalStyles.buttonSmall,
                                        plobalStyles.secondaryButton
                                    )}
                                    type="button"
                                >
                                    Previous
                                </button>
                                <button type="submit" className={plobalStyles.buttonSmall}>
                                    Join Now!
                                </button>
                            </div>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <section className={plobalStyles.popUpWrapper}>
            <div className={plobalStyles.popUpBackground} onClick={handlePopUp} />
            <div className={classNames(plobalStyles.popUpCard, styles.popUp)}>
                <button className={plobalStyles.popUpClose} onClick={handlePopUp} />
                <div className={styles.form}>
                    <h2 className={styles.formHeading}>Sign up and join us now!</h2>
                    <p>
                        Already have an account?{' '}
                        <span className={plobalStyles.link} onClick={handleLogin}>
                            Login Here
                        </span>
                    </p>
                    {renderStep()}
                    <p>
                        By joining, you are agreeing to our{' '}
                        <span className={plobalStyles.link}>Terms</span> and{' '}
                        <span className={plobalStyles.link}>Privacy Policy</span>
                    </p>
                </div>
            </div>
        </section>
    );
};
