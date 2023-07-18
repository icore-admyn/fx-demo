const jwt = require('jsonwebtoken');
const { decodeSubjectChain, calculateNet } = require('relay-jwt');
const jwa = require('jwa');
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
    const badgerFixedFee = 0.5;
    const badgerVarFee = 0.06;
    const amountWithoutBadgerFees = (amount - badgerFixedFee) / (1 + badgerVarFee);
    const netAmountForDollar = +calculateNet(amountWithoutBadgerFees, decodedChain, buxDecimals).toFixed(4);
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

const newParams = async (relayUrl, walletAddress, amount, share) => {
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
    success_url: process.env.URL + '/ipn/success?' + invoiceId,
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

module.exports = {
  feeShifting,
  splitAmounts,
  newParams
};