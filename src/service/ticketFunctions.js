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
function validate(reqBody) {
    return (reqBody.employee_id && reqBody.description && reqBody.amount)
}

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

async function submitTicket(reqBody) {
    // if(!validate(reqBody)) {
    //     return false;
    // }
    // make sure that the input has employee_id, description, amount
    if(!(reqBody.employee_id && reqBody.description && reqBody.amount)) {
        return false;
    }

    const newTicket = new Ticket(reqBody.employee_id, reqBody.description, reqBody.amount);

    let data = await createTicket(newTicket);
    return true;
}

async function getTicketsByStatus(reqQuery) {
    const { status } = reqQuery;

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

    if(ticketToBeUpdated.status !== 'pending') {
        throw new Error(`Could not change ticket status: ticket is already ${ticketToBeUpdated.status}`);
    }

    let data = await changeTicketStatus(ticket_id, status, resolver_id);

    return data ? data : null;
    // console.log(data)
    // SAMPLE OUTPUT
    // {
    //     ticket_id: 'f1f38ad5-c704-4af3-a924-9662f1d94745',
    //     employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
    //     resolver_id: -1,
    //     status: 'approved',
    //     amount: '89.99',
    //     description: 'Bought a new keyboard',
    //     creation_date: 1726768383
    //   }
}

module.exports = {
    authenticateAdminToken,
    submitTicket,
    getTicketsByStatus,
    getTicketsByUserId,
    updateTicketStatus
}