import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import styles from './qr-codes.module.scss';
import globalStyles from '../../css/global.module.scss';
import QRCode from 'qrcode.react';
import axios from 'axios';

export interface QrCodeProps {
    setQrCodePopUp: (value: boolean) => void;
    url: string;
    setForceUpdate: any;
}

const QrCode: React.FC<QrCodeProps> = ({ setQrCodePopUp, url, setForceUpdate }) => {
    const [contentState, setContentState] = useState(() => {
        return (
            <div className={styles.qrcode}>
                <QRCode value={url} />
            </div>
        )
    });

    const paymentId: any = url.split('/').pop();
    const webSocketUrl = url.replace("http", "ws");

    function HandleClose() {
        setForceUpdate((prev: any) => !prev);
        setQrCodePopUp(false);
    }

    async function fetchStatus() {
        const headers = { Accept: 'application/payment-request' };
        const response = await axios.get(url, { headers });
        const data = response.data;
        if (data.status === 'paid') {
            setContentState(() => {
                return (
                    <div className={styles.success}>
                        <h2>🎉 Deposit Successfull 🎉</h2>
                        <p>You can now close this popup.</p>
                    </div>
                )
            })
        } else {
            alert('There was an error with the payment');
        }
        console.log(data)
    }

    useEffect(() => {
        const socket = new WebSocket(webSocketUrl);
        socket.addEventListener("open", () => {
            console.log("WebSocket connection established.");
            socket.send(paymentId.toString());
        });

        socket.addEventListener("message", (event) => {
            const jsonString = event.data
            const jsonObject = JSON.parse(jsonString);
            console.log("Received message from server:", jsonObject.status);
        });

        socket.addEventListener("close", (event) => {
            if (event.wasClean) {
                console.log("WebSocket connection closed via client");
            } else {
                console.log("WebSocket connection closed via server");
                fetchStatus();
            }
        });


        return () => {
            socket.close();
        };
    }, []);

    return (
        <section className={globalStyles.popUpWrapper}>
            <div onClick={HandleClose} className={globalStyles.popUpBackground} />
            <div className={classnames(styles.popUpCard)}>
                <button onClick={HandleClose} className={globalStyles.popUpClose} />
                <div>
                    {contentState}
                </div>
                <div></div>
            </div>
        </section>
    );
};

export default QrCode;
