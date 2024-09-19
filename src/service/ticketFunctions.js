const uuid = require('uuid');

const { logger } = require('../util/logger');

const { Ticket } = require('../models/ticket');
const { createTicket } = require('../repository/ticketDAO');

/**
 * PURPOSE:
 * 
 */
function validate(reqBody) {
    return (reqBody.employee_id && reqBody.description && reqBody.amount)
}

async function submitTicket(reqBody) {
    // make sure that the input has employee_id, description, amount
    if(!validate(reqBody)) {
        return false;
    }
    
    const newTicket = new Ticket(reqBody.employee_id, reqBody.description, reqBody.amount);

    let data = await createTicket(newTicket);
    return true;
}

module.exports = {
    submitTicket,
}