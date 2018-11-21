// requires
const express = require('express');
// moongose db 
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// variable initialization to create the application
const app = express();

/* BODY PARSER */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');


// connection to the database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    };
    console.log('Mongodb is running in port 27017: \x1b[32m%s\x1b[0m', 'online');
});

// routes
app.use('/login', loginRoutes); // login
app.use('/user', userRoutes); // user
app.use('/', appRoutes); // main


// listen to requests
app.listen(3000, () => {
    console.log('Express server is running in port 3000: \x1b[32m%s\x1b[0m', 'online');
})