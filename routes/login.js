// requires
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// variable initialization to create the application
const app = express();

// user model
const User = require('../models/user');

// google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const CLIENT_SECRET = require('../config/config').CLIENT_SECRET;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        // audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        googleUser: true
    }
}

/* GOOGLE AUTH */
app.post('/google', async(req, res) => {

    const token = req.body.token;

    // wait the result of promise 
    const googleUser = await verify(token)
        .catch(error => {
            res.status(403).json({
                ok: false,
                message: 'Google Invalid token',
                error
            });
        });

    // check if the google email is already saved in my database
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error loading users',
                err
            });
        }

        // check if this user was authenticated before with google
        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    message: 'This user must use normal authentication '
                });
            } else {
                // if the user exists in db and was authenticated before with google
                // create a token, expires in 8 hours
                const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 28800 });

                // correct login
                res.status(200).json({
                    ok: true,
                    message: 'Login ok',
                    token,
                    user: userDB
                });
            }
        } else {
            // if the user no exists, create 
            const user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = 'XXXXX';

            // save user in db
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error when saving user',
                        err
                    });
                }
                // create a token, expires in 8 hours
                const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 28800 });
                // correct login
                return res.status(200).json({
                    ok: true,
                    message: 'User save in db',
                    token,
                    user: userDB
                });
            });
        }
    });
});


/* MAIN AUTH */
app.post('/', (req, res) => {

    const body = req.body;

    console.log('BODY ', body);

    // check if there is a user with the same email as the one received
    User.findOne({ email: body.email }, (err, userDB) => {

        console.log('userdb', userDB)

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
                errors: { message: `Dont exists user with this email` },
            });
        }

        // compare passwords
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                errors: { message: `Dont exists user with this password` },
            });
        }

        // create a token, expires in 8 hours
        userDB.password = '';
        const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 28800 });

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