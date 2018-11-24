// requires
const express = require('express');

// variable initialization to create the application
const app = express();

// models
const Hospital = require('../models/hospital');
const User = require('../models/user');
const Doctor = require('../models/doctor');

/* SEARCH BY COLLECTION */
app.get('/collection/:table/:term', (req, res) => {

    const table = req.params.table;
    const searchTerm = req.params.term;
    // to search for all hospitals that contain the term
    const regex = new RegExp(searchTerm, 'i');

    if (table === 'doctor') {
        getDoctors(regex).then(doctors => {
            res.status(200).json({
                ok: true,
                doctors
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                message: `Error when get the doctors data`,
                err
            });
        })
    } else if (table === 'hospital') {
        getHospitals(regex).then(hospitals => {
            res.status(200).json({
                ok: true,
                hospitals
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                message: `Error when get the hospitals data`,
                err
            });
        })
    } else {
        getUsers(regex).then(users => {
            res.status(200).json({
                ok: true,
                users
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                message: `Error when get the users data`,
                err
            });
        })
    }


});

/* GENERAL SEARCH */
app.get('/all/:term', (req, res) => {
    const searchTerm = req.params.term;
    // to search for all hospitals that contain the term
    const regex = new RegExp(searchTerm, 'i');

    // if all the promises are executed correctly ...
    Promise.all([
        getHospitals(regex),
        getDoctors(regex),
        getUsers(regex)
    ]).then(responses => {
        res.status(200).json({
            ok: true,
            hospitals: responses[0],
            doctors: responses[1],
            users: responses[2]
        });
    }).catch(err => {
        return res.status(500).json({
            ok: false,
            message: `Error when get all data`,
            err
        });
    })
});

function getHospitals(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regex }, (err, hospitalsDB) => {
            err ? reject('Error at load hospitals data: ', err) : resolve(hospitalsDB);
        });
    });
}

function getDoctors(regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regex }, (err, doctorsDB) => {
            err ? reject('Error at load doctors data: ', err) : resolve(doctorsDB);
        });
    });
}

function getUsers(regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{ 'name': regex }, { 'email': regex }]) // array of search conditions
            .exec((err, usersDB) => {
                err ? reject('Error at load users data: ', err) : resolve(usersDB);
            })
    });
}

module.exports = app;