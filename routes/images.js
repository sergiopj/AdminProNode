// requires
const express = require('express');

// variable initialization to create the application
const app = express();

const path = require('path');
const fs = require('fs');

// type of collection and img
app.get('/:type/:img', (req, res) => {

    const type = req.params.type;
    const img = req.params.img;

    const imgPath = path.resolve(__dirname, `../uploads/${type}/${img}`);
    const noImagePath = path.resolve(__dirname, '../assets/img/no-img.jpg');

    // verify if the path of the image exists
    fs.existsSync(imgPath) ? res.sendFile(imgPath) : res.sendFile(noImagePath);

});

module.exports = app;