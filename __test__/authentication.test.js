const jwt = require('jsonwebtoken');

const { decodeJWT, authenticateAdminToken } = require('../src/util/authentication');

jest.mock('jsonwebtoken');

describe('Authentication Tests', () => {
    test('decodeJWT should return a User', async () => {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6IjU2YTU2MjZjLTNiOGUtNDg3Yy04M2RjLTNmNWFkZTFkM2I0OSIsInVzZXJuYW1lIjoidGVzdC11c2VyIiwicm9sZSI6IkVtcGxveWVlIiwiaWF0IjoxNzI3MjEyMDgyLCJleHAiOjE3MjcyOTg0ODJ9.sbgJG-SFFjI_o3JWISUPNak6sP7SsP_shXgugn1h_HA';

        jwt.verify.mockResolvedValueOnce({
            employee_id: "56a5626c-3b8e-487c-83dc-3f5ade1d3b49",
            username: "test-user",
            role: "Employee",
            iat: 1727212082,
            exp: 1727298482
        });

        const result = await decodeJWT(mockToken);

        expect(jwt.verify).toHaveBeenCalled();

        expect(result).toHaveProperty('employee_id', '56a5626c-3b8e-487c-83dc-3f5ade1d3b49');
        expect(result).toHaveProperty('username', 'test-user');
        expect(result).toHaveProperty('role', 'Employee');
    });

    test('decodeJWT should throw an Error if the JWT is expired', async () => {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6IjU2YTU2MjZjLTNiOGUtNDg3Yy04M2RjLTNmNWFkZTFkM2I0OSIsInVzZXJuYW1lIjoidGVzdC11c2VyIiwicm9sZSI6IkVtcGxveWVlIiwiaWF0IjoxNzI3MjEyMDgyLCJleHAiOjE3MjcyOTg0ODJ9.sbgJG-SFFjI_o3JWISUPNak6sP7SsP_shXgugn1h_HA';

        jwt.verify = jest.fn(() => {
            throw new Error();
        })
        
        expect(async () => {
            await decodeJWT(mockToken);
        }).rejects.toThrow(new Error('invalid jwt!'));
    });

    test('authenticateAdminToken should add a user attribute to req', async () => {
        const mockReq = {
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6IjFlYTIzMWRmLWEzMGUtNDI0Zi1iZTViLWZmOGMzYzdkYjI2NiIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiTWFuYWdlciIsImlhdCI6MTcyNzMwNjg3OSwiZXhwIjoxNzI3MzkzMjc5fQ.ln9itFlcw8v7tLUQ9xDgg5bDDa36iPfRWnyVJFCM-qQ'
            }
        };
        const mockRes = {};
        mockRes.json = jest.fn();
        mockRes.status = jest.fn(() => mockRes);
        const mockNext = jest.fn();

        jwt.verify.mockResolvedValueOnce({
            employee_id: "1ea231df-a30e-424f-be5b-ff8c3c7db266",
            username: "admin",
            role: "Manager",
            iat: 1727306879,
            exp: 1727393279
        });

        await authenticateAdminToken(mockReq, mockRes, mockNext);

        expect(mockReq).toHaveProperty('user');
        expect(mockReq).toHaveProperty('user.employee_id', '1ea231df-a30e-424f-be5b-ff8c3c7db266');
    });
});