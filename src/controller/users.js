const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { decodeJWT } = require('../util/authentication');
const { logger } = require('../util/logger');

const { registerUser, login } = require('../service/userFunctions');
const { getTicketsByUserId } = require('../service/ticketFunctions');

const secretKey = process.env.JWT_SECRET_KEY;

router.route('/register')
    .get(function (req, res, next) {
        res.send('GET request to /register handled');
    })
    .post(async function (req, res, next) {
        try {
            await registerUser(req.body);

            // logger.info(`Registration of new user`);
            res.status(201).json({ message: 'Registration complete!' })
            return;
        } catch (err) {
            res.status(400).json({ message: err.message });
            return;
        }
    });

router.route('/login')
    .get(function (req, res, next) {
        res.send('GET request to /login handled');
    })
    .post(async function (req, res, next) {
        try {
            const user = await login(req.body);

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
            //res.status(202).send(`Login complete! Logged in as ${user.role} with employee_id: ${user.employee_id} and auth token: ${token}`)
            res.status(202).json(
                {
                    message: 'Login complete!',
                    role: user.role,
                    employee_id: user.employee_id,
                    authToken: token
                }
            );
            return;
        } catch (err) {
            res.status(400).json({ message: err.message });
            return;
        }
    });

router.route('/users/:userID/tickets')
    .get(async function (req, res, next) {
        // make sure the client sending this request has an id equal to :userID
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: 'Missing auth token' });
            return;
        }

        try {
            const user = await decodeJWT(token);
            const userID = req.params.userID;

            if (user.employee_id !== userID) {
                res.status(403).json({ message: 'You are not the user' })
                return;
            }

            // get all tickets where ticket.employee_id = userID
            const data = await getTicketsByUserId(userID);

            res.status(200).send(data);
            return;
        } catch (err) {
            logger.error(err);
            res.status(400).json({ message: err.message });
            return;
        }
    })

module.exports = router;