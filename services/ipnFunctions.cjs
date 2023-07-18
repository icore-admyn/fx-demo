const sendUpdate = async (transactionUpdate) => {
    const response = await axios.post('http://52.90.89.221:5372/transaction/update', transactionUpdate, {
        headers: {
            Authorization: `Bearer ${JWT}`,
        },
    });
    console.log('Transaction update response:', response.data);
}

module.exports = {
    sendUpdate
};
