// requires
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

// variable initialization to create the application
const app = express();

// middleware
app.use(fileUpload());

// models
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

// type = doctor or user or hospital -  id = userid
app.put('/:type/:id', (req, res) => {

    const type = req.params.type;
    const id = req.params.id;

    // collection types
    const collTypes = ['hospital', 'user', 'doctor'];

    // validate type of collection
    if (collTypes.indexOf(type) === -1) {
        return res.status(400).json({
            ok: false,
            message: `The collection type ${type}, is not allowed`
        });
    }

    // validate if files come
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: `Error, no files arrive`
        });
    }

    // check that the file is an image
    const file = req.files.image; // image name
    const stringCut = file.name.split('.');
    const fileExt = stringCut[stringCut.length - 1]; // .png, .jpg ... etc

    const allowedExt = ['png', 'jpg', 'gif', 'jpeg'];

    // check if the extension of file exists in the array of valid extensions
    if (allowedExt.indexOf(fileExt) === -1) {
        return res.status(400).json({
            ok: false,
            message: `The extension .${fileExt}, is not allowed`
        });
    }

    // custom file name (userid + ramdom number + file ext)
    const fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;

    // move a file to a path
    const filePath = `./uploads/${type}/${fileName}`;

    // move the file to destiny path
    file.mv(filePath, error => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: `The file ${fileName} could not be moved to the path ${filePath}`,
                error
            });
        }
        uploadByType(type, id, fileName, res);
    });
});

function uploadByType(type, id, fileName, res) {
    switch (type) {
        case 'user':
            User.findById(id, (err, userDb) => {
                if (!userDb) {
                    return res.status(400).json({
                        ok: false,
                        message: `Error, user no exists`
                    });
                }
                // if the user already had an uploaded image, need to overwrite the old path
                const oldPath = `./uploads/user/${userDb.img}`;
                // if the old file exists in path, erase it
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
                // save img name
                userDb.img = fileName;
                // save user
                userDb.save((error, updatedUser) => {
                    // no shows passw
                    updatedUser.password = '';
                    return res.status(200).json({
                        ok: true,
                        message: 'Updated user image',
                        updatedUser
                    });
                });
            });
            break;
        case 'doctor':
            Doctor.findById(id, (err, doctorDB) => {
                if (!doctorDB) {
                    return res.status(400).json({
                        ok: false,
                        message: `Error, doctor no exists`
                    });
                }
                // if the doctor already had an uploaded image, need to overwrite the old path
                const oldPath = `./uploads/doctor/${doctorDB.img}`;
                // if the old file exists in path, erase it
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
                // save img name
                doctorDB.img = fileName;
                // save doctor
                doctorDB.save((error, updatedDoctor) => {
                    return res.status(200).json({
                        ok: true,
                        message: 'Updated doctor image',
                        updatedDoctor
                    });
                });
            });
            break;
        default:
            Hospital.findById(id, (err, hospitalDb) => {
                if (!hospitalDb) {
                    return res.status(400).json({
                        ok: false,
                        message: `Error, hospital no exists`
                    });
                }
                // if the hospital already had an uploaded image, need to overwrite the old path
                const oldPath = `./uploads/hospital/${hospitalDb.img}`;
                // if the old file exists in path, erase it
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
                // save img name
                hospitalDb.img = fileName;
                // save hospital
                hospitalDb.save((error, updatedHospital) => {
                    return res.status(200).json({
                        ok: true,
                        message: 'Updated hospital image',
                        updatedHospital
                    });
                });
            });
            break;
    }
}

module.exports = app;