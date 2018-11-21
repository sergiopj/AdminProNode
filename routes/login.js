// requires
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// variable initialization to create the application
const app = express();

// user model
const User = require('../models/user');

app.post('/', (req, res) => {

    const body = req.body;

    // check if there is a user with the same email as the one received
    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error loading users',
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                errors: {message: `Dont exists user with this email`},
            });
        }

        // compare passwords
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                errors: {message: `Dont exists user with this password`},
            });
        }    
        
        // create a token, expires in 4 hours
        userDB.password = '';
        const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

        // correct login
        res.status(200).json({
            ok: true,
            message: 'Login ok',
            token,
            userDB 
        });

    });   

});












module.exports = app; 