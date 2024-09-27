const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    PutCommand,
    UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb'); // used to convert from DynamoDB JSON format to regular JSON format

const { logger } = require('../util/logger');

const client = new DynamoDBClient({region: 'us-west-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = 'Employees';

async function createUser(/* OBJECT */ User) {
    // Item = User
    const command = new PutCommand({
        TableName,
        // HAS TO BE NAMED ITEM
        Item : User
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

async function queryUserById(userId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: '#employee_id = :u_id',
        ExpressionAttributeNames: { '#employee_id': 'employee_id' },
        ExpressionAttributeValues: { ':u_id': {S: userId} }
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

async function queryUserByUsername(username) {
    const command = new QueryCommand({
        TableName,
        IndexName: 'username-join_date-index',
        KeyConditionExpression: '#username = :u',
        ExpressionAttributeNames: { '#username': 'username' },
        ExpressionAttributeValues: { ':u': {S: username} }
    });

    try {
        const data = await documentClient.send(command);

        // check if username exists in the database
        if(data.Items.length === 0) {
            return false; // username does not exist already
        }

        return unmarshall(data.Items[0]); // username exists already
    } catch(err) {
        logger.error(err);
    }
}

async function updateUserRole(user, newRole) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            'employee_id': user.employee_id,
            'join_date': user.join_date
        },
        UpdateExpression: 'set #role = :r',
        ExpressionAttributeNames: { '#role': 'role' },
        ExpressionAttributeValues: { ':r': newRole },
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
    createUser,
    queryUserById,
    queryUserByUsername,
    updateUserRole
}
