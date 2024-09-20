// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
// const uuid = require('uuid');

// const { User } = require('../src/models/user');
// const { createUser, queryUserByUsername } = require('../src/repository/userDAO');

// jest.mock('@aws-sdk/client-dynamodb', () => {
//     return {
//         DynamoDBClient: jest.fn().mockImplementation(() => { return {} })
//     }
// });
// jest.mock('@aws-sdk/lib-dynamodb', () => {
//     return {
//         mockDynamoDBDocumentClient: jest.fn().mockImplementation(() => { return {} })
//     }
// });

// test('DynamoDBDocumentClient is called', () => {
//     new mockDynamoDBDocumentClient();
//     expect(mockDynamoDBClient).toHaveBeenCalled();
// })

// beforeEach(() => {
//     mockDynamoDBDocumentClient.from.mockReturnValue({send: jest.fn()});
// })

/**
 * IMPORTANT INFO
 * createUser and queryUserByUsername are still interacting with the database
 * ex: createUser will create a user in the DB
 * need to figure out how to isolate them from the DB
 */

// describe('User DAO Tests', () => {
//     test('createUser should return metadata from creating a User record in the DB', async () => {
//         const id = uuid.v4();
//         const user = new User(id, 'test-user1', 'test');
//         // const user = {
//         //     employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
//         //     join_date: 1726689060,
//         //     username: 'admin2',
//         //     password: 'admin',
//         //     role: 'Manager'
//         // };

//         const metadata = await createUser(user);
//         console.log(metadata);
//         expect(metadata).toHaveProperty('$metadata');
//     });

//     // return a user
//     test('queryUserByUsername should return a User object if username is in DB', () => {
//         const username = 'admin2';
//         return queryUserByUsername(username)
//             .then(data => {
//                 expect(data).toHaveProperty('employee_id');
//                 expect(data).toHaveProperty('join_date');
//                 expect(data).toHaveProperty('username');
//                 expect(data).toHaveProperty('password');
//                 expect(data).toHaveProperty('role');
//             });
//     });

//     test('queryUserByUsername should return false if username is not in DB', () => {
//         const username = 'adm';
//         return queryUserByUsername(username)
//             .then(data => expect(data).toBe(false));
//     });
// });