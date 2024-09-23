const uuid = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { logger } = require('../util/logger');

const { Ticket } = require('../models/ticket');
const { createTicket, queryTicketsByStatus, queryTicketsByUserId, getTicketById, changeTicketStatus } = require('../repository/ticketDAO');

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * PURPOSE:
 * 
 */
// function validate(reqBody) {
//     return (reqBody.employee_id && reqBody.description && reqBody.amount)
// }

/**
 * PURPOSE:
 * Determine the user of this request
 */
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
    } catch(err) {
        logger.error(err);
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

    const user = await decodeJWT(token);
    if(user.role !== 'Manager') {
        res.status(403).json({message: 'Forbidden Access'});
        return;
    }

    req.user = user;
    next();
}

async function submitTicket(reqBody, eIdFromAuth) {
    // make sure that the input has employee_id, description, amount
    if(!reqBody.employee_id) {
        throw new Error('Could not submit ticket: missing ticket\'s employee id!');
    }

    if(!reqBody.description) {
        throw new Error('Could not submit ticket: missing ticket\'s description!');
    }

    if(!reqBody.amount) {
        throw new Error('Could not submit ticket: missing reimbursement amount!');
    }
    
    // the user submitting this ticket does not match the sender of the submit request
    if(reqBody.employee_id !== eIdFromAuth) {
        console.log(`reqBody: ${reqBody.employee_id}, authID: ${eIdFromAuth}`);
        throw new Error('Could not submit ticket: employee ID from auth token does not match the request body\'s employee ID');
    }

    const newTicket = new Ticket(reqBody.employee_id, reqBody.description, reqBody.amount);

    let data = await createTicket(newTicket);
    //return true;
    return {
        message: "Ticket submission successful",
        ticket_id: newTicket.ticket_id
    }
}

async function getTicketsByStatus(reqQuery) {
    const { status } = reqQuery;

    if(!status) {
        throw new Error('Could not get tickets: status query is missing');
    }

    let data = await queryTicketsByStatus(status);
    if(!data) {
        return false;
    }

    return data;
}

async function getTicketsByUserId(userId) {
    const result = await queryTicketsByUserId(userId);
    return result;
}

async function updateTicketStatus(req) {
    const { ticket_id } = req.params;
    const { status } = req.body;
    const resolver_id = req.user.employee_id;

    if(!(ticket_id && status && resolver_id)) {
        throw new Error('Could not change ticket status: missing ticket_id, status, or resolver_id');
    }

    const ticketToBeUpdated = await getTicketById(ticket_id);

    if(!ticketToBeUpdated) {
        throw new Error(`Could not change ticket status: ticket with id of ${ticket_id} does not exist!`);
    }

    if(ticketToBeUpdated.status !== 'pending') {
        throw new Error(`Could not change ticket status: ticket is already ${ticketToBeUpdated.status}`);
    }

    let data = await changeTicketStatus(ticket_id, status, resolver_id);

    return data ? data : null;
}

module.exports = {
    decodeJWT,
    authenticateAdminToken,
    submitTicket,
    getTicketsByStatus,
    getTicketsByUserId,
    updateTicketStatus
}