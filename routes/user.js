// requires
const express = require('express');
const bcrypt = require('bcryptjs');

// verify token middleware
const auth = require('../middlewares/auth').verifyToken;

// variable initialization to create the application
const app = express();

// user model
const User = require('../models/user');


/* GET ALL USERS */
app.get('/', (req, res) => {

    // to limit number of elements
    const from = Number(req.query.from) || 0;

    // find all records in db {}, only this fields ('name email img role')
    User.find({}, 'name email img role')
        .skip(from)
        .limit()
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error loading users',
                    err
                });
            }
            // count number of users
            User.count({}, (err, count) => {
                // if there are no errors
                res.status(200).json({
                    ok: true,
                    users,
                    total: count
                });
            });

        });
});

/* UPDATE USER */
app.put('/:id', auth, (req, res) => {

    // get id from url
    const id = req.params.id;

    // check if the id that arrives by parameter corresponds to a user
    User.findById(id, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error a user with id - ${id} has not been found`,
                err
            });
        }

        // save user data
        userDB.name = req.body.name;
        userDB.email = req.body.email;
        userDB.role = req.body.role;

        userDB.save((err, savedUser) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: `Error when updating the user with id - ${id}`,
                    err
                });
            }

            // no send original password
            savedUser.password = '';

            res.status(200).json({
                ok: true,
                message: 'Update user in database',
                savedUser
            });
        });
    });
});

/* CREATE NEW USER */
app.post('/', auth, (req, res) => {

    // creating a reference to a user type variable
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        img: req.body.img,
        role: req.body.role
    });

    // save user in mongodb
    user.save((err, savedUser) => {
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
            savedUser,
            userToken: req.user
        });
    });
});

/* DELETE USER */
app.delete('/:id', auth, (req, res) => {

    const id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Error when removing the user with id - ${id}`,
                err
            });
        }
        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                errors: { message: `Dont exists user with id - ${id}` },
            });
        }
        // if there are no errors
        res.status(200).json({
            ok: true,
            message: `The user with id - ${id} has been removed correctly`,
            deletedUser
        });
    });
})

module.exports = app;