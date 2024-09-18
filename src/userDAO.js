const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb'); // used to convert from DynamoDB JSON format to regular JSON format

const client = new DynamoDBClient({region: 'us-west-1'});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = 'Employees';

async function createUser(/* OBJECT */ User) {
    Item = User
    const command = new PutCommand({
        TableName,
        Item // HAS TO BE NAMED ITEM
    });

    try {
        const data = await documentClient.send(command);
        // SAMPLE OUTPUT
        // {
        //     '$metadata': {
        //       httpStatusCode: 200,
        //       requestId: 'OE9BT8TB8VF4HIIQB102CQVSI7VV4KQNSO5AEMVJF66Q9ASUAAJG',
        //       extendedRequestId: undefined,
        //       cfId: undefined,
        //       attempts: 1,
        //       totalRetryDelay: 0
        //     }
        //   }
        return data;
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    createUser,
}
