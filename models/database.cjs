const Datastore = require('nedb');

// Config Database
const usersDB = new Datastore({ filename: './database/users.db', autoload: true });
const invoiceDB = new Datastore({ filename: './database/invoices.db', autoload: true });

module.exports = {
    usersDB,
    invoiceDB
};
