const { queryUserByUsername } = require('../src/userDAO');

describe('User DAO Tests', () => {
    // return a user
    test('queryUserByUsername should return a User object if username is in DB', () => {
        const username = 'admin';
        return queryUserByUsername(username)
            .then(data => {
                expect(data).toHaveProperty('employee_id');
                expect(data).toHaveProperty('join_date');
                expect(data).toHaveProperty('username');
                expect(data).toHaveProperty('password');
                expect(data).toHaveProperty('role');
            });
    });

    test('queryUserByUsername should return false if username is not in DB', () => {
        const username = 'adm';
        return queryUserByUsername(username)
            .then(data => expect(data).toBe(false));
    });
});