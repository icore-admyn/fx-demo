const findInvoice = async (paymentId) => {
    const invoice = invoiceDB.findOne({ paymentId });
    return invoice;
}

const updateInvoice = async (paymentId) => {
    invoiceDB.update({ invoice: paymentId }, { $set: { status: 'paid' } }, { upsert: false });
    console.log(`Invoice status updated for payment ID: ${paymentId}`);
}

const sendUpdate = async (transactionUpdate) => {
    const response = await axios.post('http://52.90.89.221:5372/transaction/update', transactionUpdate, {
        headers: {
            Authorization: `Bearer ${JWT}`,
        },
    });
    console.log('Transaction update response:', response.data);
}

module.exports = {
    findInvoice,
    updateInvoice,
    sendUpdate
};
