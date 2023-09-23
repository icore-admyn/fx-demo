const jwt = require('jsonwebtoken');
const { decodeSubjectChain, calculateNet } = require('relay-jwt');
const jwa = require('jwa');
const { invoiceDB } = require('../models/database.cjs');
require('dotenv').config()


// create jwa object
const algorithm = 'ES256';
const ecdsa = jwa(algorithm);

const feeShifting = async (amount, key) => {
  try {
    if (key === undefined) {
      return amount; // If the key is empty, return the original amount
    }
    // Decode the provided key
    const decoded = jwt.decode(key);
    const decodedChain = decodeSubjectChain(decoded.sub, ecdsa.verify);
    const buxDecimals = 4;
    const badgerFixedFee = 0.0;
    const badgerVarFee = 0.05;
    const amountWithoutBadgerFees = (amount - badgerFixedFee) / (1 + badgerVarFee);
    const netAmountForDollar = +calculateNet(amountWithoutBadgerFees, decodedChain, buxDecimals).toFixed(4);

    // Return fee shifted amount 
    return netAmountForDollar;
  } catch (error) {
    // Log an error message if decoding the key fails and return oringinal amount
    console.error("An error occurred decoding the key:", error);
    return amount;
  }
};

const splitAmounts = async (walletAddress, amount, share) => {
  const totalShare = share.reduce((total, value) => total + value, 0);
  const amounts = walletAddress.map((_, index) => ((amount * share[index]) / totalShare).toFixed(4));
  return amounts;
};

const newParams = async (relayUrl, walletAddress, amount, originalAmount) => {
  // Generate a random invoice ID & custom order ID
  const invoiceId = Math.random().toString(36).substring(7);
  const customOrderId = Math.random().toString(36).substring(7);

  // Set up url params
  const params = {
    merchant_name: 'iCore Pay',
    invoice: invoiceId,
    order_key: customOrderId,
    merchant_addr: walletAddress,
    amount: amount,
    success_url: process.env.URL + '/ipn/success?amount=' + originalAmount,
    cancel_url: process.env.URL + '/ipn/error',
    ipn_url: process.env.URL + '/ipn',
    return_json: true,
  };

  // Query the params
  const queryParams = Object.keys(params)
    .map((key) => {
      if (Array.isArray(params[key])) {
        return `${key}=${encodeURIComponent(JSON.stringify(params[key]))}`;
      }
      return `${key}=${encodeURIComponent(params[key])}`;
    })
    .join('&');

  // Return the URL
  return `https://${relayUrl}?${queryParams}`;
};

// Insert user into database
const insertInvoice = async (invoice) => {
  try {
    invoiceDB.insert(invoice);
    return ({ status: true });
  } catch (err) {
    return ({ status: false, error: err });
  }
};

// Find user in the database
const findInvoice = (payId) => {
  return new Promise((resolve, reject) => {
    invoiceDB.findOne({ paymentId: payId }, (err, user) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

const updateInvoice = async (paymentId) => {
  invoiceDB.update({ paymentId: paymentId }, { $set: { status: 'paid' } }, { upsert: false });
  console.log(`Invoice status updated for payment ID: ${paymentId}`);
}

module.exports = {
  feeShifting,
  splitAmounts,
  newParams,
  insertInvoice,
  findInvoice,
  updateInvoice
};
