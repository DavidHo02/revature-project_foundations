const express = require('express');
const router = express.Router();

const { decodeJWT, authenticateAdminToken, submitTicket, getTicketsByStatus, updateTicketStatus } = require('../service/ticketFunctions');

router.route('/tickets/:ticket_id')
    .get(function (req, res, next) {
        res.status(200).send('GET request handled');
    })
    .put(authenticateAdminToken, async function (req, res, next) {
        try {
            const updatedTicket = await updateTicketStatus(req);

            res.status(202).json(updatedTicket);
            return;
        } catch (err) {
            res.status(400).json({ message: err.message });
            return;
        }
    })

router.route('/tickets')
    .get(authenticateAdminToken, async function (req, res, next) {
        try {
            const result = await getTicketsByStatus(req.query);

            res.status(200).json(result);
            return;
        } catch (err) {
            res.status(400).json({ message: err.message });
            return;
        }
    })
    .post(async function (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: 'Missing auth token!' });
            return;
        }

        const user = await decodeJWT(token);

        try {
            const result = await submitTicket(req.body, user.employee_id);

            res.status(201).json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
            return;
        }
    })

module.exports = router;