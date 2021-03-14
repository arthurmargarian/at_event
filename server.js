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
    console.log(`Connected to ${config.database} db`);
})

mongoose.connection.on('error', (err) => {
    console.log(`Db Error: ${err}`);
})


const server = express();

const users = require('./server/routes/users');

// Port Number
const port = process.env.PORT || 5000;

// // Cors Middleware
server.use(cors());

// Set Static folder
server.use(express.static("dist"));

// // Body Parser Middleware
server.use(bodyParser.json());
server.use('/users', users);

// Passport Middleware
server.use(passport.initialize());
server.use(passport.session());
require('./server/config/passport')(passport);


// Index Route
server.get('/', (req, res) => {
    res.send('invalid endpoint');
})

server.listen(port, () => {
    console.log(`Server started on ${port}`);
});
