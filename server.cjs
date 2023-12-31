const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const https = require('https');
const fs = require('fs');

// App setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './dist')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Routes import
const authRoutes = require('./routes/authRoutes.cjs')
const userRoutes = require('./routes/userRoutes.cjs')
const ipnRoutes = require('./routes/ipnRoutes.cjs')

// Routes setup
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/ipn', ipnRoutes);

// Start the server
const port = process.env.PORT || 80;
const sslKeyPath = process.env.SSL_KEY_PATH;
const sslCertPath = process.env.SSL_CERT_PATH;

if (sslKeyPath && sslCertPath) {
  const options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };

  https.createServer(options, app).listen(port, () => {
    console.log(`Server listening on port ${port} with SSL enabled`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
