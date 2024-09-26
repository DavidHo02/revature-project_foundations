const jwt = require('jsonwebtoken');
require('dotenv').config();

const { logger } = require('../util/logger');

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * PURPOSE:
 * Determine the user of this request
 */
async function decodeJWT(token) {
    try {
        const user = await jwt.verify(token, secretKey);
        return user;
    } catch(err) {
        logger.error(err);
        throw new Error('invalid jwt!');
    }
}

async function authenticateAdminToken(req, res, next) {
    // Bearer token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        res.status(401).json({message: 'Unauthorized Access'});
        return;
    }

    try {
        const user = await decodeJWT(token);

        if(user.role !== 'Manager') {
            res.status(403).json({message: 'Forbidden Access'});
            return;
        }

        req.user = user;
        next();
        return;
    } catch(err) {
        logger.error(err);
        res.status(400).json({ message: err.message});
        return;
    }
}

module.exports = {
    decodeJWT,
    authenticateAdminToken
};