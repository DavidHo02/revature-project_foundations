const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    PutCommand,
    UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb'); // used to convert from DynamoDB JSON format to regular JSON format

const { logger } = require('../util/logger');

const { Ticket } = require('../models/ticket');

const client = new DynamoDBClient({region: 'us-west-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = 'Tickets';

async function createTicket(Ticket) {
    const command = new PutCommand({
        TableName,
        Item: Ticket
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

async function queryTicketsByStatus(status) {
    const command = new QueryCommand({
        TableName,
        IndexName: 'status-creation_date-index',
        KeyConditionExpression: '#status = :s',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':s': {S: status} }
    });

    try {
        const data = await documentClient.send(command);

        if(data.Items.length === 0) {
            // return false;
            return [];
        }

        /**
         * can't unmarshall data.Items because it's an array, so unmarshall each record inside data.Items
         * then put each unmarshalled record inside the items array
         */
        const items = data.Items.map((record) => {
            return unmarshall(record);
        })

        return items;
    } catch(err) {
        logger.error(err);
    }
}

async function queryTicketsByUserId(userId) {
    const command = new QueryCommand({
        TableName,
        IndexName: 'employee_id-creation_date-index',
        KeyConditionExpression: '#employee_id = :e_id',
        ExpressionAttributeNames: { '#employee_id': 'employee_id' },
        ExpressionAttributeValues: { ':e_id': {S: userId} }
    });

    try {
        const data = await documentClient.send(command);
        
        if(data.Items.length === 0) {
            // return false;
            return [];
        }

        /**
         * can't unmarshall data.Items because it's an array, so unmarshall each record inside data.Items
         * then put each unmarshalled record inside the items array
         */
        const items = data.Items.map((record) => {
            return unmarshall(record);
        })

        return items;
    } catch(err) {
        logger.error(err);
    }
}

async function getTicketById(ticket_id) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: '#ticket_id = :t_id',
        ExpressionAttributeNames: { '#ticket_id': 'ticket_id' },
        ExpressionAttributeValues: { ':t_id': {S: ticket_id} }
    });

    try {
        const data = await documentClient.send(command)

        if(data.Items.length === 0) {
            return null;
        }

        return unmarshall(data.Items[0]);
    } catch(err) {
        logger.error(err);
    }
}

async function changeTicketStatus(ticket_id, newStatus, resolver_id) {
    // check to see if a ticket with ticket_id exists in the DB
    const ticket = await getTicketById(ticket_id);

    // if it does not exist, EXIT
    if(!ticket) {
        // console.log('ticket does not exist');
        return false;
    }

    // if it does exist, check if the status is pending
    // if the status is not pending, EXIT
    // if(ticket.status !== 'pending') {
    //     // console.log('ticket\'s status is NOT pending');
    //     return false;
    // }

    // if the status is pending, update the ticket's status to newStatus in the DB,
    // and update the ticket's resolver
    const command = new UpdateCommand({
        TableName,
        Key: {
            'ticket_id': ticket_id,
            'creation_date': ticket.creation_date
        },
        UpdateExpression: 'set #status = :s, #resolver_id = :r',
        ExpressionAttributeNames: {
            '#status': 'status',
            '#resolver_id': 'resolver_id'
        },
        ExpressionAttributeValues: {
            ':s': newStatus,
            ':r': resolver_id
        },
        ReturnValues: 'ALL_NEW'
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes;
    } catch(err) {
        logger.error(err);
    }
}

module.exports = {
    createTicket,
    queryTicketsByStatus,
    queryTicketsByUserId,
    getTicketById,
    changeTicketStatus
}