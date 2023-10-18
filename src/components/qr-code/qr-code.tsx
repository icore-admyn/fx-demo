import classnames from 'classnames';
import styles from './qr-codes.module.scss';
import globalStyles from '../../css/global.module.scss';
import QRCode from 'qrcode.react';

export interface QrCodeProps {
    setQrCodePopUp: (value: boolean) => void;
    url: string;
    setForceUpdate: any
}

const QrCode = ({ setQrCodePopUp, url, setForceUpdate }: QrCodeProps) => {

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
                    <QRCode value={url} />
                </div>
                <div></div>
            </div>
        </section>
    );
};

export default QrCode;
