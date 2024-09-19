const { User } = require('../src/models/user');
const { queryUserByUsername } = require('../src/userDAO');
const { registerUser, login } = require('../src/userFunctions');

// mock a user
const user = {
    password: 'david123',
    username: 'david2',
    role: 'Employee',
    join_date: 1726686455,
    employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
};

describe('User Creation Tests', () => {

    test('A new user should be created', () => {
        const result = new User('aatrox', 'league');
        expect(result).not.toBeNull();
    });

    test('A newly created user should have an employee_id, join_date, username, password, and role', () => {
        const result = new User('ahri', 'fox');
        expect(result.employee_id).not.toBeNull();
        expect(result.join_date).not.toBeNull();
        expect(result.username).not.toBeNull();
        expect(result.password).not.toBeNull();
        expect(result.role).not.toBeNull();
    });
});

describe('User DAO Tests', () => {
    // return a user
    test('A user should be returned with all the properties', () => {
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
});

describe('User Function Tests', () => {
    const mockQueryUserByUsername = jest.fn();

    // successful login
    test('login should return a role of Employee', () => {
        const username = 'david2';
        const password = 'david123';
        return login(username, password)
            .then(data => expect(data).toBe('Employee'));
    });

    // successful login
    test('login should return a role of Manager', () => {
        const username = 'admin';
        const password = 'admin';
        return login(username, password)
            .then(data => expect(data).toBe('Manager'));
    });

    // failed login
    test('login should return false', () => {
        const username = 'dav';
        const password = 'david123';
        login(username, password)
            .then(data => expect(data).toBe(false));
    })
});


describe('Learning mock', () => {

    test('test', () => {
        const mock = jest.fn();
        let result = mock('foo');
        expect(result).toBeUndefined();
        expect(mock).toHaveBeenCalled();
        expect(mock).toHaveBeenCalledTimes(1);
        expect(mock).toHaveBeenCalledWith('foo');
    });

    test('mock implementation', () => {
        const mock = jest.fn(() => 'bar');

        expect(mock('foo')).toBe('bar');
        expect(mock).toHaveBeenCalledWith('foo');
    });
});