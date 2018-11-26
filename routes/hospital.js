'use strict'
// requires
const express = require('express');

// verify token middleware
const auth = require('../middlewares/auth').verifyToken;

// variable initialization to create the application
const app = express();

// user model
const Hospital = require('../models/hospital');


/* GET ALL HOSPITALS */
app.get('/', (req, res) => {

    // to limit number of elements
    const from = Number(req.query.from) || 0;

    // find all records in db {}
    Hospital.find({})
        .skip()
        .limit(from)
        // populate to define what data you want from another table or collection
        .populate('users', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error loading hospitals',
                    err
                });
            }

            // count number of hospitals
            Hospital.count({}, (err, count) => {
                // if there are no errors
                res.status(200).json({
                    ok: true,
                    hospitals,
                    total: count
                });
            });
        });
});


/* CREATE NEW HOSPITAL */
app.post('/', auth, (req, res) => {

    // creating a reference to a hospital type variable
    const hospital = new Hospital({
        name: req.body.name,
        user: req.user._id,
        img: req.body.img
    });

    // save user in mongodb
    hospital.save((err, savedHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error when saving hospital in the database',
                err
            });
        }
        // if there are no errors
        res.status(201).json({
            ok: true,
            message: 'Hospital saved in the database',
            savedHospital
        });
    });
});

/* UPDATE HOSPITAL */
app.put('/:id', auth, (req, res) => {

    // get id from url
    const id = req.params.id;

    // check if the id that arrives by parameter corresponds to a hospital
    Hospital.findById(id, (err, hospitalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error a hospital with id - ${id} has not been found`,
                err
            });
        }

        // save hospital data
        hospitalDB.name = req.body.name;
        hospitalDB.user = req.user._id;

        hospitalDB.save((err, savedHospital) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: `Error when updating the hospital with id - ${id}`,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                message: 'Update hospital in database',
                savedHospital
            });
        });
    });
});

/* DELETE HOSPITAL */
app.delete('/:id', auth, (req, res) => {

    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error when removing the hospital with id - ${id}`,
                err
            });
        }
        if (!deletedHospital) {
            return res.status(400).json({
                ok: false,
                errors: { message: `Dont exists hospital with id - ${id}` },
            });
        }
        // if there are no errors
        res.status(200).json({
            ok: true,
            message: `The hospital with id - ${id} has been removed correctly`,
            deletedHospital
        });
    });
});

module.exports = app;