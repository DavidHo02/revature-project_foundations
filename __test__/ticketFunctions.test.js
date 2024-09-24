const { Ticket } = require('../src/models/ticket');
const { createTicket, queryTicketsByStatus, queryTicketsByUserId, getTicketById, changeTicketStatus } = require('../src/repository/ticketDAO');
const { submitTicket, getTicketsByStatus, getTicketsByUserId, updateTicketStatus } = require('../src/service/ticketFunctions');

jest.mock('../src/repository/ticketDAO', () => {
    const originalModule = jest.requireActual('../src/repository/ticketDAO');

    return {
        ...originalModule,
        createTicket: jest.fn(),
        queryTicketsByStatus: jest.fn(),
        queryTicketsByUserId: jest.fn(),
        getTicketById: jest.fn(),
        changeTicketStatus: jest.fn()
    }
});

describe('Ticket Creation Tests', () => {

    test('A new ticket should be created', () => {
        const sampleEmployeeId = '52caac7a-e48f-4587-9eac-c87422f4ba89';
        const sampleDescription = 'Purchased new monitor';
        const sampleAmount = '102.53';
        const ticket = new Ticket(sampleEmployeeId, sampleDescription, sampleAmount);

        expect(ticket).not.toBeNull();
    });

    test('A newly created ticket should have ticket_id, creation_date, employee_id, resolver_id, description, amount, and status', () => {
        const sampleEmployeeId = '52caac7a-e48f-4587-9eac-c87422f4ba89';
        const sampleDescription = 'Purchased new monitor';
        const sampleAmount = '102.53';
        const ticket = new Ticket(sampleEmployeeId, sampleDescription, sampleAmount);

        expect(ticket).toHaveProperty('ticket_id');
        expect(ticket).toHaveProperty('creation_date');
        expect(ticket).toHaveProperty('employee_id');
        expect(ticket).toHaveProperty('resolver_id');
        expect(ticket).toHaveProperty('description');
        expect(ticket).toHaveProperty('amount');
        expect(ticket).toHaveProperty('status');
    });
});

describe('Ticket Service Tests', () => {

    test('submitTicket should return an object with a message and ticket_id property', async () => {
        const reqBody = {
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
            description: 'Purchased new office chair',
            amount: 89.99
        }

        const result = await submitTicket(reqBody, '52caac7a-e48f-4587-9eac-c87422f4ba89');

        expect(createTicket).toHaveBeenCalled();
        expect(result).toHaveProperty('message');
        expect(result.message).toBe('Ticket submission successful');
        expect(result).toHaveProperty('ticket_id');
    });

    test('submitTicket should throw an error when trying to submit a ticket with a missing amount', async () => {
        const reqBody = {
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
            description: 'test',
            amount: null
        }

        expect(async () => {
            await submitTicket(reqBody, '52caac7a-e48f-4587-9eac-c87422f4ba89');
        }).rejects.toThrow(new Error('Could not submit ticket: missing reimbursement amount!'));
    });

    test('submitTicket should throw an error when trying to submit a ticket with a missing employee_id', async () => {
        const mockReqBody = {
            employee_id: null,
            description: 'test',
            amount: 89.99
        }

        expect(async () => {
            await submitTicket(mockReqBody, '52caac7a-e48f-4587-9eac-c87422f4ba89');
        }).rejects.toThrow(new Error('Could not submit ticket: missing ticket\'s employee id!'));
    });

    test('submitTicket should throw an error when trying to submit a ticket with a missing description', async () => {
        const mockReqBody = {
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
            description: null,
            amount: 89.99
        }

        expect(async () => {
            await submitTicket(mockReqBody, '52caac7a-e48f-4587-9eac-c87422f4ba89');
        }).rejects.toThrow(new Error('Could not submit ticket: missing ticket\'s description!'));
    });

    test('submitTicket should throw an error when trying to submit a ticket with a missing description', async () => {
        const mockReqBody = {
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
            description: 'test',
            amount: 89.99
        }

        expect(async () => {
            await submitTicket(mockReqBody, 'differentID');
        }).rejects.toThrow(new Error('Could not submit ticket: employee ID from auth token does not match the request body\'s employee ID'));
    });

    test('getTicketsByStatus should return an empty list ', async () => {
        const reqQuery = {
            status: 'pending'
        }
        queryTicketsByStatus.mockReturnValueOnce([]);

        const result = await getTicketsByStatus(reqQuery);

        expect(result).toHaveLength(0);
    });

    test('getTicketsByStatus should return a nonempty list', async () => {
        const reqQuery = {
            status: 'pending'
        }
        queryTicketsByStatus.mockReturnValueOnce([
            {
                ticket_id: "c1faed78-5ab9-495e-9e2d-2d5c7589751d",
                employee_id: "56a5626c-3b8e-487c-83dc-3f5ade1d3b49",
                status: "pending",
                resolver_id: "-1",
                amount: "103.45",
                description: "Bought gas for company car",
                creation_date: 1727111362
            },
            {
                ticket_id: "0e5b18fe-6fe9-402b-afb5-bfc4be652582",
                employee_id: "20d656b5-3c41-4bff-a1fb-f759f2e29656",
                status: "pending",
                resolver_id: "-1",
                amount: "1,241.21",
                description: "Plane ticket for company conference",
                creation_date: 1727109715
            }
        ]);

        const result = await getTicketsByStatus(reqQuery);

        expect(result).toHaveLength(2);
    });

    test('getTicketsByStatus should throw an Error when status is null', () => {
        const mockReqQuery = {
            status: null
        };

        expect(async () => {
            await getTicketsByStatus(mockReqQuery);
        }).rejects.toThrow('Could not get tickets: status query is missing');
    });

    test('getTicketsByUserId should return an empty list ', async () => {
        queryTicketsByUserId.mockReturnValueOnce([]);

        const result = await getTicketsByUserId('20d656b5-3c41-4bff-a1fb-f759f2e29656');

        expect(result).toHaveLength(0);
    });

    test('getTicketsByUserId should return a nonempty list', async () => {
        queryTicketsByUserId.mockReturnValueOnce([
            {
                ticket_id: "0e5b18fe-6fe9-402b-afb5-bfc4be652582",
                employee_id: "20d656b5-3c41-4bff-a1fb-f759f2e29656",
                status: "approved",
                resolver_id: "1ea231df-a30e-424f-be5b-ff8c3c7db266",
                amount: "103.45",
                description: "Bought gas for company car",
                creation_date: 1727109715
            }
        ]);

        const result = await getTicketsByUserId('20d656b5-3c41-4bff-a1fb-f759f2e29656');

        expect(result).toHaveLength(1);
    });

    test('updateTicketStatus should return ', async () => {
        const mockReq = {
            body: {
                status: 'approved'
            },
            params: {
                ticket_id: '0e5b18fe-6fe9-402b-afb5-bfc4be652582'
            },
            user: {
                employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
                username: 'admin',
                role: 'Manager',
                iat: 1727117261,
                exp: 1727203661
            }
        };

        getTicketById.mockReturnValueOnce({
            ticket_id: '0e5b18fe-6fe9-402b-afb5-bfc4be652582',
            creation_date: 0,
            amount: 89.99,
            description: 'lorem',
            employee_id: 'mockEmployeeID',
            resolver_id: '-1',
            status: 'pending'
        });

        changeTicketStatus.mockReturnValueOnce({
            ticket_id: '0e5b18fe-6fe9-402b-afb5-bfc4be652582',
            creation_date: 0,
            amount: 89.99,
            description: 'lorem',
            employee_id: 'mockEmployeeID',
            resolver_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
            status: 'approved'
        });

        const result = await updateTicketStatus(mockReq);

        expect(result).toHaveProperty('resolver_id', '1ea231df-a30e-424f-be5b-ff8c3c7db266');
        expect(result).toHaveProperty('status', 'approved');
    })

    test('updateTicketStatus should throw an error when trying to update a ticket with a missing update field', async () => {
        const mockReq = {
            body: {
                status: null
            },
            params: {
                ticket_id: '0e5b18fe-6fe9-402b-afb5-bfc4be652582'
            },
            user: {
                employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
                username: 'admin',
                role: 'Manager',
                iat: 1727117261,
                exp: 1727203661
            }
        };

        expect(async () => {
            await updateTicketStatus(mockReq);
        }).rejects.toThrow(new Error('Could not change ticket status: missing ticket_id, status, or resolver_id'));
    });

    test('updateTicketStatus should throw an error when trying to update a ticket that does not exist', async () => {
        const mockReq = {
            body: {
                status: 'approved'
            },
            params: {
                ticket_id: 'doesNotExist'
            },
            user: {
                employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
                username: 'admin',
                role: 'Manager',
                iat: 1727117261,
                exp: 1727203661
            }
        };

        getTicketById.mockReturnValueOnce(false);

        expect(async () => {
            await updateTicketStatus(mockReq);
        }).rejects.toThrow(new Error('Could not change ticket status: ticket with id of doesNotExist does not exist!'))
    });

    test('updateTicketStatus should throw an error when trying to update a ticket with status not pending', async () => {
        const mockReq = {
            body: {
                status: 'approved'
            },
            params: {
                ticket_id: '0e5b18fe-6fe9-402b-afb5-bfc4be652582'
            },
            user: {
                employee_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
                username: 'admin',
                role: 'Manager',
                iat: 1727117261,
                exp: 1727203661
            }
        };

        getTicketById.mockReturnValueOnce(
            {
                ticket_id: '0e5b18fe-6fe9-402b-afb5-bfc4be652582',
                employee_id: '20d656b5-3c41-4bff-a1fb-f759f2e29656',
                resolver_id: '1ea231df-a30e-424f-be5b-ff8c3c7db266',
                status: 'approved',
                amount: '103.45',
                description: 'Bought gas for company car',
                creation_date: 1727109715
              }
        );

        expect(async () => {
            await updateTicketStatus(mockReq);
        }).rejects.toThrow(new Error('Could not change ticket status: ticket is already approved'))
    });

})