const express = require('express');
const router = express.Router();

const { authenticateAdminToken, submitTicket, getTicketsByStatus, updateTicketStatus } = require('../service/ticketFunctions');

router.route('/submit')
    .get()
    .post(async function (req, res, next) {
        let result = await submitTicket(req.body);

        if(!result) {
            res.status(400).json({message: 'Could not submit ticket: missing employee_id, description, or amount!'});
            return;
        }

        res.status(201).send('Ticket submitted!');
        return;
    })

router.route('/tickets/:ticket_id')
    .get(function (req, res, next) {
        // req.params is an object
        //console.log(req.params);
        res.status(200).send('GET request handled');
    })
    .put(authenticateAdminToken, async function (req, res, next) {
        const updatedTicket = await updateTicketStatus(req);

        if(!updatedTicket) {
            res.status(400).json({message: 'Could not update ticket\'s status'});
            return;
        }

        res.status(202).json(updatedTicket);
        return;
    })

router.route('/tickets')
    .get(async function (req, res, next) {
        // console.log(req.query);
        let result = await getTicketsByStatus(req.query);

        res.status(200).json(result);
        return;
    })

module.exports = router;