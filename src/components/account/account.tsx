import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import globalStyles from '../../css/global.module.scss';
import styles from './account.module.scss';
import axios from 'axios';

export interface AccountProps {
    setAccountPopUp: (value: boolean) => void;
    setDepositPopUp: (value: boolean) => void;
    userSettings: any;
    setUserSettings: (settings: any) => void;
    setIsLoggedIn: (value: boolean) => void;
    setForceUpdate: any;
}

export const Account = ({
    setAccountPopUp,
    setDepositPopUp,
    userSettings,
    setUserSettings,
    setIsLoggedIn,
    setForceUpdate
}: AccountProps) => {
    const [editedSettings, setEditedSettings] = useState(userSettings.settings);
    const [mainBalance, setMainBalance] = useState(userSettings.mainBalance);
    const [bonusBalance, setBonusBalance] = useState(userSettings.bonusBalance);
    const [shareError, setShareError] = useState('');

    function handlePopUp() {
        setForceUpdate((prev: any) => !prev);
        setEditedSettings(userSettings);
        setAccountPopUp(false);
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        handlePopUp();
    }

    function handleInputChange(event: any) {
        const { name, value } = event.target;
        
        // Check if value starts with 'https://' or 'http://'
        const sanitizedValue = value.startsWith('https://') || value.startsWith('http://')
            ? value.slice(value.indexOf('://') + 3) // Remove it
            : value;
    
        setEditedSettings((prevSettings: any) => ({
            ...prevSettings,
            [name]: sanitizedValue
        }));
    }
    

    async function handleSubmit(event: any) {
        event.preventDefault();
        if (!isSharesValid()) {
            setShareError('Shares must equal 100');
            return;
        }
        const submitSettings = {
            ...userSettings,
            mainBalance: mainBalance,
            bonusBalance: bonusBalance,
            settings: editedSettings
        }
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}`, };
            const response = await axios.post('/user/', submitSettings, { headers });
            console.log(response.data);
            setUserSettings(submitSettings);
            handlePopUp();
        } catch (error) {
            setUserSettings(submitSettings);
            setEditedSettings(userSettings);
            console.error(error)
        }
    }

    function isSharesValid() {
        const shares = editedSettings.share || [];
        const totalShares = shares.reduce((sum: any, share: any) => sum + parseInt(share), 0);
        return totalShares === 100;
    }

    function handleAddWallet(event: any) {
        event.preventDefault();
        if (editedSettings.walletAddress.length >= 5) return;
        const updatedWalletAddresses = [...editedSettings.walletAddress, ''];
        const updatedShares = [...editedSettings.share, ''];
        setEditedSettings((prevSettings: any) => ({
            ...prevSettings,
            walletAddress: updatedWalletAddresses,
            share: updatedShares
        }));
    }

    function handleWalletAddressChange(index: any, event: any) {
        const updatedWalletAddresses = [...editedSettings.walletAddress];
        updatedWalletAddresses[index] = event.target.value;
        setEditedSettings((prevSettings: any) => ({
            ...prevSettings,
            walletAddress: updatedWalletAddresses
        }));
    }

    function handleShareChange(index: any, event: any) {
        const updatedShares = [...editedSettings.share];
        updatedShares[index] = parseInt(event.target.value);
        setEditedSettings((prevSettings: any) => ({
            ...prevSettings,
            share: updatedShares
        }));
    }

    function handleReset(event: any) {
        event.preventDefault();
        setMainBalance(0);
        setBonusBalance(0);
    }


    function handleRemoveWallet(event: any, index: any) {
        event.preventDefault();
        const updatedWalletAddresses = [...editedSettings.walletAddress];
        updatedWalletAddresses.splice(index, 1);
        const updatedShares = [...editedSettings.share];
        updatedShares.splice(index, 1);
        const hasOneWalletRemaining = updatedWalletAddresses.length === 1;

        setEditedSettings((prevSettings: any) => ({
            ...prevSettings,
            walletAddress: updatedWalletAddresses,
            share: hasOneWalletRemaining ? [100] : updatedShares
        }));
    }


    return (
        <section className={globalStyles.popUpWrapper}>
            <div onClick={handlePopUp} className={globalStyles.popUpBackground} />
            <div className={classnames(globalStyles.popUpCard, styles.popUpCard)}>
                <button onClick={handlePopUp} className={globalStyles.popUpClose} />
                <div className={styles.wrapper}>
                    <div className={styles.head}>
                        <div className={styles.headingWrapper}>
                            <h2 className={styles.heading}>My Account</h2>
                        </div>
                        <div className={styles.currencyWrapper}>
                            <p className={styles.text}>
                                Main Balance:<strong>${mainBalance}</strong>
                            </p>
                            <p className={styles.text}>
                                Bonus Balance:<strong>${bonusBalance}</strong>
                            </p>
                        </div>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.sidebar}>
                            <div className={styles.tabLink}>Wallet</div>
                            <div className={styles.tabLink}>Promotions</div>
                            <div className={styles.tabLink}>Settings</div>
                            <button className={styles.logout} onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                        <div className={styles.main}>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div>
                                    <div className={globalStyles.inputWrapper}>
                                        <label>Relay URL:</label>
                                        <input
                                            type="text"
                                            name="relayUrl"
                                            placeholder="Relay URL"
                                            value={editedSettings.relayUrl || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className={globalStyles.inputWrapper}>
                                        <label>Key <em>(Optional)</em>:</label>
                                        <input
                                            type="text"
                                            name="key"
                                            value={editedSettings.key || ''}
                                            onChange={handleInputChange}
                                            placeholder="Key"
                                        />
                                    </div>
                                    {editedSettings.walletAddress.length === 1 ? (
                                        <div className={globalStyles.inputWrapper}>
                                            <label>Wallet Address:</label>
                                            <input
                                                type="text"
                                                name="walletAddress"
                                                value={editedSettings.walletAddress[0] || ''}
                                                onChange={(event) => handleWalletAddressChange(0, event)}
                                                placeholder="Wallet Address"
                                                required
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {editedSettings.walletAddress.map((walletAddress: any, index: any) => (
                                                <div key={index} className={styles.walletWrapper}>
                                                    <div className={globalStyles.inputWrapper}>
                                                        <label>Wallet Address:</label>
                                                        <input
                                                            type="text"
                                                            name="walletAddress"
                                                            value={walletAddress || ''}
                                                            onChange={(event) => handleWalletAddressChange(index, event)}
                                                            placeholder="Wallet Address"
                                                            required
                                                        />
                                                    </div>
                                                    <div className={globalStyles.inputWrapper}>
                                                        <label>Share:</label>
                                                        <input
                                                            type="number"
                                                            name="share"
                                                            value={editedSettings.share[index] || ''}
                                                            onChange={(event) => handleShareChange(index, event)}
                                                            placeholder="Share"
                                                            required
                                                        />
                                                    </div>
                                                    {index !== 0 && (
                                                        <button
                                                            className={styles.removeWallet}
                                                            onClick={(event) => handleRemoveWallet(event, index)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {shareError && <p className={styles.error}>{shareError}</p>}
                                    <div className={styles.buttonWrapper}>
                                        <div>
                                            {editedSettings.walletAddress.length < 5 && (
                                                <button className={classnames(
                                                    globalStyles.buttonSmall,
                                                    globalStyles.secondaryButton,
                                                )} onClick={(event) => handleAddWallet(event)}>
                                                    Add Wallet
                                                </button>
                                            )}
                                            <button className={classnames(
                                                globalStyles.buttonSmall,
                                                globalStyles.secondaryButton,
                                            )} onClick={(event) => handleReset(event)}>
                                                Reset Balance
                                            </button>
                                        </div>
                                        <button type="submit" className={globalStyles.buttonSmall}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};