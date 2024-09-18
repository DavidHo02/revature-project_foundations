const express = require('express');
const router = express.Router();

router.route('/register')
    .get(function (req, res, next) {
        res.send('GET request to /register handled');
    })
    .post();

router.route('/login')
    .get(function (req, res, next) {
        res.send('GET request to /login handled');
    })
    .post();

module.exports = router;