const { logger } = require('../util/logger');
const { decodeJWT, authenticateAdminToken } = require('../util/authentication');

const { Ticket } = require('../models/ticket');
const { createTicket, queryTicketsByStatus, queryTicketsByUserId, getTicketById, changeTicketStatus } = require('../repository/ticketDAO');

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
    // if(!data) {
    //     return false;
    // }

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

    return data;
}

module.exports = {
    decodeJWT,
    authenticateAdminToken,
    submitTicket,
    getTicketsByStatus,
    getTicketsByUserId,
    updateTicketStatus
}