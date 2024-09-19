const { User } = require('../src/models/user');
const { registerUser, login } = require('../src/service/userFunctions');

// partial mocking of userDAO.js
// https://jestjs.io/docs/mock-functions#mocking-partials
jest.mock('../src/repository/userDAO', () => {
    const originalModule = jest.requireActual('../src/repository/userDAO');

    return {
        ...originalModule,
        queryUserByUsername: jest.fn(),
        createUser: jest.fn(),
    }
});

const { queryUserByUsername, createUser } = require('../src/repository/userDAO');

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

describe('User Function Tests', () => {
    // successful registration of a User
    test('registerUser should return true when trying to register a new User', () => {
        const username = 'david2';
        const password = 'david123';
        queryUserByUsername.mockReturnValueOnce(false);
        return registerUser(username, password)
            .then((data) => {
                expect(createUser).toHaveBeenCalled();
                expect(data).toBe(true);
            });
    });

    // failed registration of a User
    test('registerUser should return false when trying to register an already registered username', () => {
        const username = 'david2';
        const password = 'david123';
        queryUserByUsername.mockReturnValueOnce({
            password: 'david123',
            username: 'david2',
            role: 'Employee',
            join_date: 1726686455,
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
        });
        return registerUser(username, password)
            .then((data) => {
                expect(data).toBe(false);
            });
    });

    // successful login of Employee account
    test('login should return a User with a role property of Employee', () => {
        const username = 'david2';
        const password = 'david123';
        queryUserByUsername.mockReturnValueOnce({
            password: 'david123',
            username: 'david2',
            role: 'Employee',
            join_date: 1726686455,
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
        });
        return login(username, password)
            .then((data) => {
                expect(queryUserByUsername).toHaveBeenCalled();
                expect(queryUserByUsername).toHaveBeenCalledWith(username);
                // expect(data.role).toBe('Employee');
                expect(data).toHaveProperty('role', 'Employee');
            });
    });

    // successful login of Manager account
    test('login should return a User with a role property of Manager', () => {
        const username = 'admin';
        const password = 'admin';
        queryUserByUsername.mockReturnValueOnce({
            password: 'admin',
            username: 'admin',
            role: 'Manager',
            join_date: 1726689060,
            employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266'
        });
        return login(username, password)
            .then((data) => {
                expect(queryUserByUsername).toHaveBeenCalled();
                expect(queryUserByUsername).toHaveBeenCalledWith(username);
                // expect(data.role).toBe('Manager');
                expect(data).toHaveProperty('role', 'Manager');
            });
    });

    // failed login
    test('login should return false when trying to login with a wrong username', () => {
        const username = 'dav';
        const password = 'david123';
        queryUserByUsername.mockReturnValueOnce(false);
        return login(username, password)
            .then((data) => {
                expect(queryUserByUsername).toHaveBeenCalled();
                expect(queryUserByUsername).toHaveBeenCalledWith(username);
                expect(data).toBe(false);
            });
    })

    // failed login
    test('login should return false when trying to login with a wrong password', () => {
        const username = 'admin';
        const password = 'feafd';
        queryUserByUsername.mockReturnValueOnce({
            password: 'admin',
            username: 'admin',
            role: 'Manager',
            join_date: 1726689060,
            employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266'
        });
        return login(username, password)
            .then((data) => {
                expect(queryUserByUsername).toHaveBeenCalled();
                expect(queryUserByUsername).toHaveBeenCalledWith(username);
                expect(data).toBe(false);
            });
    })
});