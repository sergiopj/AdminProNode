// requires
const express = require('express');
// moongose db 
const mongoose = require('mongoose')
    // connection to the database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    };
    console.log('Mongodb is running in port 27017: \x1b[32m%s\x1b[0m', 'online');
});

// variable initialization to create the application
const app = express();

// routes
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'Correctly attended request'
    })
})

// listen to requests
app.listen(3000, () => {
    console.log('Express server is running in port 3000: \x1b[32m%s\x1b[0m', 'online');
})