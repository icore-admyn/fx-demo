const { usersDB } = require('../models/database.cjs');

// Find user in the database
const findUser = (email) => {
    return new Promise((resolve, reject) => {
        usersDB.findOne({ email }, (err, user) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

// Insert user into database
const insertUser = async (user) => {
    try {
        usersDB.insert(user);
        return ({ status: true });
    } catch (err) {
        return ({ status: false, error: err });
    }
};

// Update user in database
const updateUser = (userId, updatedData, res) => {
    usersDB.update({ _id: userId }, updatedData, {}, (err, numReplaced) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        } else if (numReplaced === 0) {
            res.status(404).send({ error: 'User not found' });
        } else {
            res.status(200).send('Settings have been updated!');
        }
    });
};

// Create new user
const createUser = async (email, hashedPassword, relayUrl, walletAddress, key) => {
    return {
        email: email,
        password: hashedPassword,
        mainBalance: 0,
        bonusBalance: 0,
        settings: {
            relayUrl: relayUrl,
            walletAddress: [walletAddress],
            share: [100],
            key: key
        }
    };
}

const updateUserBalance = async (updatedRecord) => {
    const bonus = updatedRecord.bonus || 0;
    usersDB.update(
        { username: updatedRecord.user },
        {
            $inc: {
                mainBalance: parseFloat(updatedRecord.amount),
                bonusBalance: bonus,
            },
        },
        { returnUpdatedDocs: true }
    );
    console.log('User data updated successfully');
}

module.exports = {
    findUser,
    insertUser,
    updateUser,
    createUser,
    updateUserBalance
};
