const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    PutCommand,
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
            return false;
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

// createTicket(new Ticket('52caac7a-e48f-4587-9eac-c87422f4ba89', 'test', 12.34));

module.exports = {
    createTicket,
    queryTicketsByStatus
}