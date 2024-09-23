const express = require('express');
const router = express.Router();

const { authenticateAdminToken, submitTicket, getTicketsByStatus, updateTicketStatus } = require('../service/ticketFunctions');

// router.route('/submit')
//     .get()
//     .post(async function (req, res, next) {
//         let result = await submitTicket(req.body);

//         if(!result) {
//             res.status(400).json({message: 'Could not submit ticket: missing employee_id, description, or amount!'});
//             return;
//         }

//         // TODO: send back ticket_id
//         res.status(201).send('Ticket submitted!');
//         return;
//     })

router.route('/tickets/:ticket_id')
    .get(function (req, res, next) {
        // req.params is an object
        //console.log(req.params);
        res.status(200).send('GET request handled');
    })
    .put(authenticateAdminToken, async function (req, res, next) {
        try {
            const updatedTicket = await updateTicketStatus(req);

            res.status(202).json(updatedTicket);
            return;
        } catch(err) {
            res.status(400).json(err.message);
            return;
        }
    })

router.route('/tickets')
    .get(authenticateAdminToken, async function (req, res, next) {
        try {
            const result = await getTicketsByStatus(req.query);

            res.status(200).json(result);
            return;
        } catch(err) {
            res.status(400).json(err.message);
            return;
        }
    })
    // TODO: change ticket submission to require auth header to confirm it is the user submitting
    .post(async function (req, res, next) {
        try {
            const result = await submitTicket(req.body);
            
            res.status(201).json(result);
        } catch(err) {
            res.status(400).json(err.message);
            return;
        }
    })

module.exports = router;