const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./server/config/db');

// Connect to db
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log(`Connected to Database`);
})

mongoose.connection.on('error', (err) => {
    console.log(`Db Error: ${err}`);
})


const app = express();

const auth = require('./server/routes/auth');

// Port Number
const port = process.env.PORT || 3000;

// // CORS Middleware
app.use(cors());

// Set Static folder
app.use(express.static("dist"));

// // Body Parser Middleware
app.use(bodyParser.json());
app.use('/auth', auth);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./server/config/passport')(passport);

// Localization Get
app.get('/assets/i18n/en.json', (req, res) => {
  const en = require('./src/assets/i18n/en-US.json');
  res.send(en);
})

app.get('/assets/i18n/hy.json', (req, res) => {
  const en = require('./src/assets/i18n/hy-AM.json');
  res.send(en);
})

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
})

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
