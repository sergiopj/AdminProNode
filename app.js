// requires
const express = require('express');
// moongose db 
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// variable initialization to create the application
const app = express();

// cors middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

/* BODY PARSER */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imagesRoutes = require('./routes/images');


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
app.use('/doctor', doctorRoutes); // doctor
app.use('/hospital', hospitalRoutes); // hospital
app.use('/search', searchRoutes); // search data
app.use('/upload', uploadRoutes); // upload files
app.use('/images', imagesRoutes); // images
app.use('/', appRoutes); // main


// listen to requests
app.listen(3000, () => {
    console.log('Express server is running in port 3000: \x1b[32m%s\x1b[0m', 'online');
})