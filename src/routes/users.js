const express = require('express');
const router = express.Router();

const { logger } = require('../util/logger');

const { registerUser } = require('../userFunctions');

router.route('/register')
    .get(function (req, res, next) {
        res.send('GET request to /register handled');
    })
    .post(function (req, res, next) {
        const { username, password } = req.body;

        // check if username or password are empty
        if(!username || !password) {
            res.status(400).send('Could not register: username or password is missing!');
            return;
        }

        // registerUser returns a promise because it is an async function
        registerUser(username, password)
            .then((data) => {
                // console.log(data);
                // check if data is false
                if(!data) {
                    res.status(400).send('Could not register: username is already taken!');
                    return;
                }
                
                res.status(201).send('Registration complete!');
            });
    });

router.route('/login')
    .get(function (req, res, next) {
        res.send('GET request to /login handled');
    })
    .post(function (req, res, next) {
        res.send('POST request to /login handled');
    });

module.exports = router;