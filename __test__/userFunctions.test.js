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
    test('registerUser should return true when trying to register a new User', async () => {
        const reqBody = {
            username: 'david2',
            password: 'david123'
        };

        queryUserByUsername.mockReturnValueOnce(false);

        const result = await registerUser(reqBody);
        expect(createUser).toHaveBeenCalled();
        expect(queryUserByUsername).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    // // failed registration of a User
    test('registerUser should throw an Error when trying to register an already registered username', async () => {
        const reqBody = {
            username: 'david2',
            password: 'david123'
        };

        queryUserByUsername.mockReturnValueOnce({
            password: 'david123',
            username: 'david2',
            role: 'Employee',
            join_date: 1726686455,
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
        });

        expect(async () => {
            await registerUser(reqBody);
        }).rejects.toThrow();
        expect(queryUserByUsername).toHaveBeenCalled();
    });

    // successful login of Employee account
    test('login should return a User with a role property of Employee', async () => {
        const reqBody = {
            username: 'david2',
            password: 'david123'
        };

        queryUserByUsername.mockReturnValueOnce({
            password: 'david123',
            username: 'david2',
            role: 'Employee',
            join_date: 1726686455,
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
        });

        const result = await login(reqBody);
        expect(queryUserByUsername).toHaveBeenCalled();
        expect(queryUserByUsername).toHaveBeenCalledWith(reqBody.username);
        expect(result).toHaveProperty('role', 'Employee');
    });

    // successful login of Manager account
    test('login should return a User with a role property of Manager', async () => {
        const reqBody = {
            username: 'admin',
            password: 'admin'
        };

        queryUserByUsername.mockReturnValueOnce({
            password: 'admin',
            username: 'admin',
            role: 'Manager',
            join_date: 1726689060,
            employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266'
        });

        const result = await login(reqBody);
        expect(queryUserByUsername).toHaveBeenCalled();
        expect(queryUserByUsername).toHaveBeenCalledWith(reqBody.username);
        expect(result).toHaveProperty('role', 'Manager');
    });

    // failed login
    test('login should throw an Error when trying to login with a wrong username', async () => {
        const reqBody = {
            username: 'dav',
            password: 'david123'
        };

        queryUserByUsername.mockReturnValueOnce(false);

        expect(async () => {
            await login(reqBody);
        }).rejects.toThrow();
    })

    // failed login
    test('login should throw an Error when trying to login with a wrong password', async () => {
        const reqBody = {
            username: 'admin',
            password: 'feafd'
        };

        queryUserByUsername.mockReturnValueOnce({
            password: 'admin',
            username: 'admin',
            role: 'Manager',
            join_date: 1726689060,
            employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266'
        });

        expect(async () => {
            await login(reqBody);
        }).rejects.toThrow();
    })
});