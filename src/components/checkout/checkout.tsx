import React, { useEffect } from 'react';
import classnames from 'classnames';
import styles from './checkout.module.scss';
import globalStyles from '../../css/global.module.scss';

export interface CheckoutProps {
    setCheckoutPopUp: (value: boolean) => void;
    url: string;
}

export const Checkout = ({ setCheckoutPopUp, url }: CheckoutProps) => {
    function HandlePopUp() {
        setCheckoutPopUp(false);
        window.location.reload()
    }

    const paymentId: any = url.split('/').pop();
    const webSocketUrl = url.replace("https://", "wss://");
    console.log(paymentId, webSocketUrl);

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

        socket.addEventListener("close", () => {
            console.log("WebSocket connection closed.");
        });

        return () => {
            socket.close();
        };
    }, []);

    return (
        <section className={globalStyles.popUpWrapper}>
            <div onClick={HandlePopUp} className={globalStyles.popUpBackground} />
            <div className={classnames(globalStyles.popUpCard, styles.popUpCard)}>
                <button onClick={HandlePopUp} className={globalStyles.popUpClose} />
                <div className={styles.checkoutWrapper}>
                    <iframe className={styles.checkout} src={url} width="100%" height="400px" title="Badger Payment" />
                </div>
                <div></div>
            </div>
        </section>
    );
};


