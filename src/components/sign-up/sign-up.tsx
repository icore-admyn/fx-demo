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
        key: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk2ODQ0NTcsImF1ZCI6InRlc3QiLCJpc3MiOiJ0ZXN0Lmljb3JlcGF5LmlvIiwic3ViIjoiQUVCQURhZE1WSmlKOCt1SzZYNS9WRXBjS1lySXdjQ1R3VUc3Q3d2aWRlcTRjdW1KSU9ZdGRlWnBzMG1ITzdhRWRzRDFUMjFSVTROS0RyeVBLbFVuQktIcFdEQldNQkFHQnlxR1NNNDlBZ0VHQlN1QkJBQUtBMElBQkZnT1djSUR6TlJ2SGJmWFlhYnFxdXhReFpVYkVnM25IRmxIamZWRTk2UFMxelBneXRveUZHcExzbVg5ZXFrTDRlNnIrSmFWWXhoWXV4c2V0andKWEQ4QkFBQUFBQUFBQUFBQUFFQlBsd0xlaEVlZTJoVFJRRk1MdmJ2enphOFdkbXkyNWlSelJocmxka3pPZHVBNEtPeW1KVjc2c0h1T2JFWlgvYVdyOHFCbWRLSmJUMFdCUmIrWXlwWjFXREJXTUJBR0J5cUdTTTQ5QWdFR0JTdUJCQUFLQTBJQUJGZUo0U3VtTHZ6YTZQSFB1MUVka3pOVnRmaWFiTHlOaWVsbkNnTTFVK1E3d2FsK3Q5eFg1OWRhNHdzVWFPUzcwbjFRTjNLU1ZlQUdWc2lRQmFGdTh3Y0JBQUFBQUFBQUFBTHVBRUJYQkNrN1FHQWN1SUF1VXNhTnp1YjI4Y3BLbzVINWpJTlljRFJMTy9mMFNsMUVtWXVOWm1YZkJSN0hWNnJkZ1FwTUR3MW5FVTB1TmxrWlJhcmxFRCtjV0RCV01CQUdCeXFHU000OUFnRUdCU3VCQkFBS0EwSUFCQ1FSVE9PV1BPNnVKRXBQYWFEV0RKV3ZFMGtCVEYxNnAxOTZIU28vdUVsbThBYVd0YXVGYnpzMFh4V0JxajNkd1diRXZIMWZzNVY2WWFPZDJxRTQ5UVlCQUFBQUFBQUFBQUFqQUVBUmNQcE9DZVNRSnpNNkpzakw0VE04UFEzTXZhek9TQ2w2aWZtUFFYd3k0UmtDNEU4SEFVSW9CYWIxektNZThWZ1ZwOHJMdWxIMXVMRDd3aFNiRTJvRldEQldNQkFHQnlxR1NNNDlBZ0VHQlN1QkJBQUtBMElBQk9VaG1iWDJnVnFzZXA0RVpLeXNxdTRZeXhwc2FjVTVhSzJtMVp3eldxZzhiQ2txdFhzYkhPc1gvQjR3WDdPWWFQOWNveUYvTHZHMDZnQ2ZtUDlqcGZJQkFBQUFBQUFBQUFBUCJ9.p1tUOokKS-kG-gxzwMkaafDvL2H-MdD8fvVlAMSiHiZmRxMeFTyORrK7HCM2NIv2zfLvpX4oZ3YvjNQLHAlkTA',
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
                                    value={formData.key}
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
                            <p>Key: {formData.key}</p>
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
