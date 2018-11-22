// requires
const express = require('express');

// verify token middleware
const auth = require('../middlewares/auth').verifyToken;

// variable initialization to create the application
const app = express();

// doctor model
const Doctor = require('../models/doctor');


/* GET ALL DOCTORS */
app.get('/', (req, res) => {

    // to limit number of elements
    const from = Number(req.query.from) || 0;

    // find all records in db {}
    Doctor.find({})
        .skip()
        .limit(from)
        .populate('users')
        .populate('hospitals')
        .exec((err, doctors) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error loading doctors',
                    err
                });
            }

            // count number of doctors
            Doctor.count({}, (err, count) => {
                // if there are no errors
                res.status(200).json({
                    ok: true,
                    doctors,
                    total: count
                });
            });

        });
});


/* CREATE NEW DOCTOR */
app.post('/', auth, (req, res) => {

    // creating a reference to a doctor type variable
    const doctor = new Doctor({
        name: req.body.name,
        hospital: req.body.hospital,
        user: req.user._id
    });

    // save doctor in mongodb
    doctor.save((err, savedDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error when saving doctor in the database',
                err
            });
        }
        // if there are no errors
        res.status(201).json({
            ok: true,
            message: 'Doctor saved in the database',
            savedDoctor,
            userToken: req.user
        });
    });
});

/* UPDATE DOCTOR */
app.put('/:id', auth, (req, res) => {

    // get id from url
    const id = req.params.id;

    // check if the id that arrives by parameter corresponds to a doctor
    Doctor.findById(id, (err, doctorDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error a doctor with id - ${id} has not been found`,
                err
            });
        }

        // save doctor data
        doctorDB.name = req.body.name;
        doctorDB.hospital = req.body.hospital;
        doctorDB.user = req.user._id;

        doctorDB.save((err, savedDoctor) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: `Error when updating the doctor with id - ${id}`,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                message: 'Update doctor in database',
                savedDoctor
            });
        });
    });
});


/* DELETE DOCTOR */
app.delete('/:id', auth, (req, res) => {

    const id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error when removing the doctor with id - ${id}`,
                err
            });
        }
        if (!deletedDoctor) {
            return res.status(400).json({
                ok: false,
                errors: { message: `Dont exists doctor with id - ${id}` },
            });
        }
        // if there are no errors
        res.status(200).json({
            ok: true,
            message: `The doctor with id - ${id} has been removed correctly`,
            deletedDoctor
        });
    });

})


module.exports = app;