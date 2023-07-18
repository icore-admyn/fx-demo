const { newParams, splitAmounts, feeShifting } = require('../services/balanceFunctions.cjs')
const { findUser, updateUser } = require('../services/userFunctions.cjs')
const axios = require('axios');

const getUser = async (req, res) => {
    try {
        // Find user settings
        const user = await findUser(req.email)
        return res.status(201).json({ user });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
}

const editUser = (req, res) => {
    try {
        const updatedData = req.body;
        const userId = updatedData._id;
        updateUser(userId, updatedData, res);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

const deposit = async (req, res) => {
    try {
        // Find user settings
        const user = await findUser(req.email);
        const key = user.settings.key;
        const amount = req.body.amount;

        // Shift fees and build url
        const shiftedAmount = await feeShifting(amount, key);
        const arrayAmount = await splitAmounts(user.settings.walletAddress, shiftedAmount, user.settings.share);
        const url = await newParams(user.settings.relayUrl, user.settings.walletAddress, arrayAmount, user.settings.share)
        console.log(amount, shiftedAmount, arrayAmount)
        
        // Create auth headers if key is present
        const headers = {};
        if (key !== undefined) { headers.authorization = `Bearer ${key}` }

        // GET request for invoice
        const response = await axios.get(url, { headers });
        const invoice = response.data;
        invoice.amount = amount;
        invoice.user = req.email;

        // Redirect user to checkout
        const payUrl = invoice.paymentUrl;
        return res.status(201).json({ payUrl });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUser,
    editUser,
    deposit
}