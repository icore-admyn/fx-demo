import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import styles from './deposit.module.scss';
import globalStyles from '../../css/global.module.scss';
import axios from 'axios';
import { ReactComponent as Loading } from '../../assets/svgs/loading.svg';

export interface DepositProps {
    setDepositPopUp: (value: boolean) => void;
    setCheckoutPopUp: (value: boolean) => void;
    setPaymentUrl: (value: string) => void;
}

export const Deposit = ({ setDepositPopUp, setCheckoutPopUp, setPaymentUrl }: DepositProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: 20,
    });

    function handlePopUp() {
        setDepositPopUp(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}`, };
            const response = await axios.post('/user/deposit', formData, { headers });
            const { payUrl } = response.data;
            setPaymentUrl(payUrl);
            setCheckoutPopUp(true)
            console.log(payUrl);
            handlePopUp();
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    };

    return (
        <section className={globalStyles.popUpWrapper}>
            <div className={globalStyles.popUpBackground} onClick={handlePopUp} />
            <div className={classNames(globalStyles.popUpCard, styles.popUp, globalStyles.test)}>
                <button className={globalStyles.popUpClose} onClick={handlePopUp} />
                <h2 className={styles.formHeading}>Great choice! 🎉</h2>
                <p>Enter how much you would like to deposit.</p>
                <form className={globalStyles.form} onSubmit={handleSubmit}>
                    <div>
                        <div className={globalStyles.inputWrapper}>
                            <label>Deposit:</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Deposit"
                                required
                            />
                        </div>
                        <div className={styles.buttonWrapper}>
                            <div></div>
                            {isLoading ? (
                                <Loading className={styles.loading} />
                            ) : (
                                <button type="submit" className={globalStyles.buttonSmall}>
                                    Deposit
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <p>
                    <strong>Note:</strong> This is a non-refunadable transaction, by continuing you
                    are agreeing to the <span className={globalStyles.link}>Terms</span> and{' '}
                    <span className={globalStyles.link}>Privacy Policy</span>
                </p>
            </div>
        </section>
    );
};
