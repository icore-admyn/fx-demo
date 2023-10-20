const jwt = require('jsonwebtoken');
const { decodeSubjectChain, calculateNet } = require('relay-jwt');
const jwa = require('jwa');
const { invoiceDB } = require('../models/database.cjs');
require('dotenv').config()


// create jwa object
const algorithm = 'ES256';
const ecdsa = jwa(algorithm);

const getMerchantAmount = (target, rates, decimals = 1) => {
  const estimatedFeeFactor = rates.reduce((acc, rate) => acc * (1 + rate), 1) * 1.05;
  console.log("estimatedFeeFactor", estimatedFeeFactor);
  const rangeStart = +(target / (estimatedFeeFactor + 0.01)).toFixed(4);
  const rangeEnd = +(target / (estimatedFeeFactor - 0.01)).toFixed(4);
  console.log("range", rangeStart, rangeEnd);
  const step = 10 ** (-decimals);
  console.log("step", step);
  let merchantAmount;
  for (let m = rangeStart; m < rangeEnd; m = +(m + step).toFixed(4)) {
    const tokenAmount = rates.reduce((accumulator, rate) => +(accumulator * (1 + rate)).toFixed(4), m);
    const purchaseTokenAmount = +(Math.ceil(tokenAmount * 100) / 100).toFixed(2);
    const totalAmount = +(Number((purchaseTokenAmount * 1.01).toFixed(2)) + Number((Number((purchaseTokenAmount * 1.01).toFixed(2)) * 0.04).toFixed(2))).toFixed(2);
    console.log("m", m, "TA", totalAmount);

    if (totalAmount === target) {
      merchantAmount = m;
      break;
    }
  }

  console.log("merchantAmount", merchantAmount);

  return merchantAmount || getMerchantAmount(target, rates, decimals + 1);
}

const feeShifting = async (amount, key) => {
  const amountSantized = parseFloat(amount);
  
  try {
    if (key === undefined) {
      return amount; // If the key is empty, return the original amount
    }
    // Decode the provided key
    const decoded = jwt.decode(key);
    const decodedChain = decodeSubjectChain(decoded.sub, ecdsa.verify);
    const getRates = () => {
      const array = [];
      decodedChain.forEach((obj) => {
        array.push(obj.amount / 1000);
      })
      return array;
    };
    const rates = getRates();

    const netAmountForDollar = getMerchantAmount(amountSantized, rates);
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
