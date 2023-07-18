import React, { useState, useEffect } from 'react';
import styles from './login.module.scss';
import globalStyles from '../../css/global.module.scss';
import axios from 'axios';

export interface LoginProps {
    setSignUpPopUp: (value: boolean) => void;
    setLoginPopUp: (value: boolean) => void;
    setIsLoggedIn: (value: boolean) => void;
}

export const Login = ({
    setSignUpPopUp,
    setLoginPopUp,
    setIsLoggedIn,
}: LoginProps) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    function handlePopUp() {
        setLoginPopUp(false);
    }

    function handleSignUp() {
        setLoginPopUp(false);
        setSignUpPopUp(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', formData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            handlePopUp();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className={globalStyles.popUpWrapper} id="background">
            <div className={globalStyles.popUpBackground} onClick={handlePopUp} />
            <div className={globalStyles.popUpCard} >
                <button className={globalStyles.popUpClose} onClick={handlePopUp} />
                <h2 className={styles.formHeading}>Welcome Back!</h2>
                <p>Enter your email and password to log in.</p>
                <p>
                    First time here?{' '}
                    <span className={globalStyles.link} onClick={handleSignUp}>
                        Sign Up Here
                    </span>
                </p>
                <form className={globalStyles.form} onSubmit={handleSubmit}>
                    <div>
                        <div className={globalStyles.inputWrapper}>
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
                        <div className={globalStyles.inputWrapper}>
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
                        <div className={styles.buttonWrapper}>
                            <div></div>
                            <button type="submit" className={globalStyles.buttonSmall}>
                                Log In
                            </button>
                        </div>
                    </div>
                </form>
                <p>
                    By joining, you are agreeing to our{' '}
                    <span className={globalStyles.link}>Terms</span> and{' '}
                    <span className={globalStyles.link}>Privacy Policy</span>
                </p>
            </div>
        </section>
    );
};
