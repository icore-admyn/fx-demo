const { findInvoice, updateInvoice } = require('../services/balanceFunctions.cjs')
const { updateUserBalance, } = require('../services/userFunctions.cjs')

async function ipn(req, res) {
    try {
        // Get invoice data
        const ipn = req.body;
        const paymentId = ipn.payment_id;
        const invoice = await findInvoice(paymentId);
        const amount = invoice.amount;
        const bonus = invoice.bonus;
        const user = invoice.user;

        // Decode blockchain data

        // Compare invoice data

        // Update invoice databse and user balance
        updateInvoice(paymentId)
        updateUserBalance(user, amount, bonus)

        // Send success status
        console.log('IPN processed successfully');
        res.status(200).send('IPN recieved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const success = (req, res) => {
    const amount = req.query.amount;
    res.render('success', { amount });
}

const error = (req, res) => {
    res.render('error');
}

module.exports = {
    ipn,
    success,
    error
};
