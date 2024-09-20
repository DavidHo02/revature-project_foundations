const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { logger } = require('../util/logger');

const { registerUser, login } = require('../service/userFunctions');
const { getTicketsByUserId } = require('../service/ticketFunctions');

const secretKey = process.env.JWT_SECRET_KEY;

router.route('/register')
    .get(function (req, res, next) {
        res.send('GET request to /register handled');
    })
    .post(function (req, res, next) {
        const { username, password } = req.body;

        // check if username or password are empty
        if (!username || !password) {
            //res.status(400).send('Could not register: username or password is missing!');
            res.status(400).json({ message: 'Could not register: username or password is missing!' })
            return;
        }

        // registerUser returns a promise because it is an async function
        registerUser(username, password)
            .then((data) => {
                // console.log(data);
                // check if data is false
                if (!data) {
                    //res.status(400).send('Could not register: username is already taken!');
                    res.status(400).json({ message: 'Could not register: username is already taken!' });
                    return;
                }

                logger.info(`Registration of new user`);
                // res.status(201).send('Registration complete!');
                res.status(201).json({ message: 'Registration complete!' })
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
        if (!username || !password) {
            //res.status(400).send('Could not login: username or password is missing!');
            res.status(400).json({ message: 'Could not login: username or password is missing!' });
            return;
        }

        // login returns a promise because it is an async function
        const user = await login(username, password);
        if (!user) {
            res.status(400).json({ message: 'Could not login: invalid credentials!' });
            return;
        }

        // generate JWT token
        const token = jwt.sign(
            {
                employee_id: user.employee_id,
                username: user.username,
                role: user.role
            },
            secretKey,
            {
                expiresIn: '1d'
            }
        );

        logger.info(`User ${user.username}:${user.employee_id} logged in`);
        //res.status(201).send(`Login complete! Logged in as ${user.role}`);
        res.status(202).send(`Login complete! Logged in as ${user.role} with employee_id: ${user.employee_id} and auth token: ${token}`)
        return;
    });

async function decodeJWT(token) {
    try {
        const user = await jwt.verify(token, secretKey);
        return user;
        // console.log(user);
        // {
        //     id: '95875b90-2c04-4d10-8709-7a7470740095',
        //     username: 'test-user',
        //     role: 'Employee',
        //     iat: 1726845007,
        //     exp: 1726931407
        //   }
    } catch (err) {
        logger.error(err);
    }
}

router.route('/users/:userID/tickets')
    .get(async function (req, res, next) {
        // make sure the client sending this request has an id equal to :userID
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: 'Unauthorized Access' });
            return;
        }

        const userID = req.params.userID;
        const user = await decodeJWT(token);
        console.log(user);

        if(user.employee_id !== userID) {
            res.status(403).json({ message: 'You are not the user'})
            return;
        }

        // get all tickets where ticket.employee_id = userID
        const data = await getTicketsByUserId(userID);

        res.status(200).send(data);
        return;
    })

module.exports = router;