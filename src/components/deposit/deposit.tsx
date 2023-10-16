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
    setQrCodePopUp: (value: boolean) => void;
}

export const Deposit = ({ setDepositPopUp, setCheckoutPopUp, setPaymentUrl, setQrCodePopUp }: DepositProps) => {
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

    const handleQrCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.post('/user/deposit', formData, { headers });
            const { payUrl } = response.data;
            setPaymentUrl(payUrl);
            setQrCodePopUp(true);
            console.log(payUrl);
            handlePopUp();
            setIsLoading(false)
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    };

    const handleDeposit = async (e: React.FormEvent) => {
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
            <div className={classNames(globalStyles.popUpCard, styles.popUp, globalStyles.imageUrl)}>
                <button className={globalStyles.popUpClose} onClick={handlePopUp} />
                <h2 className={styles.formHeading}>Great choice! 🎉</h2>
                <p>Enter how much you would like to deposit.</p>
                <form className={globalStyles.form}>
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
                                <div className={styles.buttonWrapper}>
                                    <button
                                        type="submit"
                                        onClick={handleQrCode}
                                        className={classNames(
                                            globalStyles.buttonSmall,
                                            globalStyles.secondaryButton
                                        )}>
                                        QR Code
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleDeposit}
                                        className={globalStyles.buttonSmall}
                                    >
                                        Deposit
                                    </button>
                                </div>
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
