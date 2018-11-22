// requires
const express = require('express');

// variable initialization to create the application
const app = express();

// models
const Hospital = require('../models/hospital');
const User = require('../models/user');
const Doctor = require('../models/doctor');


app.get('/all/:term', (req, res) => {

    const searchTerm = req.params.term;
    // to search for all hospitals that contain the term
    const regex = new RegExp(searchTerm, 'i');

    let hospitalData;
    let userData;
    let doctorData;

    Hospital.find({ name: regex }, (err, hospitalDB) => {
        hospitalData = hospitalDB;
    });

    res.status(200).json({
        ok: true,
        message: 'All hospitals',
        hospitals: hospitalData
    });

});


module.exports = app;