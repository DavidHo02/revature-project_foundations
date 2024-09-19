const express = require('express');
const router = express.Router();

const { logger } = require('../util/logger');

const { registerUser, login } = require('../service/userFunctions');

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
                    //res.status(400).send('Could not register: username is already taken!');
                    res.status(400).json({message: 'Could not register: username is already taken!'});
                    return;
                }
                
                res.status(201).send('Registration complete!');
                return;
            });
    });

router.route('/login')
    .get(function (req, res, next) {
        res.send('GET request to /login handled');
    })
    .post(async function (req, res, next) {
        const { username, password } = req.body;

        // check if username or password are empty
        if(!username || !password) {
            //res.status(400).send('Could not login: username or password is missing!');
            res.status(400).json({message: 'Could not login: username or password is missing!'});
            return;
        }

        // login returns a promise because it is an async function
        const user = await login(username, password);
        if(!user) {
            res.status(400).json({message: 'Could not login: invalid credentials!'});
            return;
        }

        //res.status(201).send(`Login complete! Logged in as ${user.role}`);
        res.status(201).send(`Login complete! Logged in as ${user.role} with employee_id: ${user.employee_id}`)
        return;
    });

module.exports = router;