async function ipn(req, res) {
    try {
        const ipn = req.body;
        const paymentId = ipn.payment_id;
        console.log('ipn:', ipn)
        console.log('IPN processed successfully');
        res.send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const success = (req, res) => {
    const id = req.query.id;
    const amount = 20;
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
