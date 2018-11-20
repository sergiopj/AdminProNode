// requires
const express = require('express');

// variable initialization to create the application
const app = express();

// user model
const User = require('../models/user');


/* GET ALL USERS */
app.get('/', (req, res) => {
    // find all records in db {}, only this fields ('name email img role')
    User.find({}, 'name email img role')
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error loading users',
                    err
                });
            }
            // if there are no errors
            res.status(200).json({
                ok: true,
                users
            });
        });  
});

/* CREATE NEW USER */
app.post('/', (req, res) => {

    // creating a reference to a user type variable
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        img: req.body.img,
        role: req.body.role 
    });

    // save user in mongodb
    user.save( (err, savedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error when saving user in the database',
                err
            });
        }
        // if there are no errors
        res.status(201).json({
            ok: true,
            message: 'User saved in the database',
            savedUser
        });
    });

    
});

module.exports = app;