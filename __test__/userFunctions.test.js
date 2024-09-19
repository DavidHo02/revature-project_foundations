const { User } = require('../src/models/user');
const { registerUser, login } = require('../src/userFunctions');

// partial mocking of userDAO.js to only mock queryUserByUsername function
// https://jestjs.io/docs/mock-functions#mocking-partials
jest.mock('../src/userDAO', () => {
    const originalModule = jest.requireActual('../src/userDAO');

    return {
        ...originalModule,
        queryUserByUsername: jest.fn().mockReturnValueOnce({
            password: 'david123',
            username: 'david2',
            role: 'Employee',
            join_date: 1726686455,
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
        }),
    }
});

const { queryUserByUsername } = require('../src/userDAO');
// console.log(queryUserByUsername());
// OUTPUT:
// {
//     password: 'david123',
//     username: 'david2',
//     role: 'Employee',
//     join_date: 1726686455,
//     employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89'
// };

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
    // const queryUserByUsernameResult = queryUserByUsername();

    // successful login of Employee account
    test('login should return a role of Employee', () => {
        const username = 'david2';
        const password = 'david123';
        return login(username, password)
            .then((data) => {
                expect(queryUserByUsername).toHaveBeenCalled();
                expect(data).toBe('Employee');
            });
    });

    // successful login of Manager account
    test('login should return a role of Manager', () => {
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
                expect(data).toBe('Manager');
            });
    });

    // failed login
    test('login should return false', () => {
        const username = 'dav';
        const password = 'david123';
        queryUserByUsername.mockReturnValueOnce(false);
        return login(username, password)
            .then((data) => {
                expect(queryUserByUsername).toHaveBeenCalled();
                expect(data).toBe(false);
            });
    })
});