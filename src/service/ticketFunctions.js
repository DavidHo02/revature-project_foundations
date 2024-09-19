const uuid = require('uuid');

const { logger } = require('../util/logger');

const { Ticket } = require('../models/ticket');
const { createTicket, queryTicketsByStatus, changeTicketStatus } = require('../repository/ticketDAO');

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

async function getTicketsByStatus(reqQuery) {
    const { status } = reqQuery;

    let data = await queryTicketsByStatus(status);
    if(!data) {
        return false;
    }

    return data;
}

async function updateTicketStatus(req) {
    const { ticket_id } = req.params;
    const { status } = req.body;

    // console.log(`ticket_id is: ${ticket_id}, status is: ${status}`);

    if(!(ticket_id && status)) {
        return false;
    }

    let data = await changeTicketStatus(ticket_id, status);

    return data;
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
    submitTicket,
    getTicketsByStatus,
    updateTicketStatus
}