import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import styles from './qr-codes.module.scss';
import globalStyles from '../../css/global.module.scss';
import axios from 'axios';

export interface QrCodeProps {
    setQrCodePopUp: (value: boolean) => void;
    url: string;
    setForceUpdate: any
}

const QrCode = ({ setQrCodePopUp, url, setForceUpdate }: QrCodeProps) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            const headers = { Accept: 'image/png' };
            const response = await axios.get(url, { headers, responseType: 'blob' });
            const data = response.data;
            const image = URL.createObjectURL(data);
            setImageUrl(image);
        };

        fetchImage();
    }, [url]);

    function HandlePopUp() {
        setForceUpdate((prev: any) => !prev);
        setQrCodePopUp(false);
    }

    return (
        <section className={globalStyles.popUpWrapper}>
            <div onClick={HandlePopUp} className={globalStyles.popUpBackground} />
            <div className={classnames(styles.popUpCard)}>
                <button onClick={HandlePopUp} className={globalStyles.popUpClose} />
                <div className={styles.checkoutWrapper}>
                    <img src={imageUrl} alt='QR-Code' />
                </div>
                <div></div>
            </div>
        </section>
    );
};

export default QrCode;
