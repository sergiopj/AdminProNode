// requires
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

/* VERIFY TOKEN middleware*/
exports.verifyToken = (req, res, next) => {
    // get token from url
    const token = req.query.token;
    // Verify if the token is valid
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Invalid Token',
                err
            });
        }
        // in the request we have the user information
        req.user = decoded.user;
        // If everything is fine you can continue
        next();
    });
}