const axios = require('axios');
const { findUser } = require('../services/userFunctions.cjs')

const sendUpdate = async (paymentId, key) => {
    try {
        const url = 'http://3.87.213.174:5372/transaction/update';
        const headers = { Authorization: `Bearer ${key}` };
        const body = { paymentId: paymentId, status: "paid" };
        const response = await axios.post(url, body, { headers });
        console.log('Transaction update response:', response.data);
    } catch (error) {
        console.error('Error', error)
    }
}

module.exports = {
    sendUpdate
};
