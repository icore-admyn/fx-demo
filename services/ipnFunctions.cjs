const axios = require('axios');

const sendUpdate = async (paymentId, user) => {
    const response = await axios.post('http://3.87.213.174:5372/transaction/update', { paymentId: paymentId, status: 'paid' }, {
        headers: {
            Authorization: `Bearer ${user.key}`,
        },
    });
    console.log('Transaction update response:', response.data);
}

module.exports = {
    sendUpdate
};
