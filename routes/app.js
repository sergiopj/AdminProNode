// requires
const express = require('express');

// variable initialization to create the application
const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'Correctly attended request'
    });
});


module.exports = app;