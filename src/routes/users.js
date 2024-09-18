const express = require('express');
const router = express.Router();

const { registerUser } = require('../userFunctions');

router.route('/register')
    .get(function (req, res, next) {
        res.send('GET request to /register handled');
    })
    .post(function (req, res, next) {
        const { username, password } = req.body;
        registerUser(username, password);
        res.send('POST request to /register handled');
    });

router.route('/login')
    .get(function (req, res, next) {
        res.send('GET request to /login handled');
    })
    .post(function (req, res, next) {
        res.send('POST request to /login handled');
    });

module.exports = router;