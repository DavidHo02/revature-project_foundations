const { Ticket } = require('../src/models/ticket');
const { createTicket, queryTicketsByStatus } = require('../src/repository/ticketDAO');
const { submitTicket, getTicketsByStatus } = require('../src/service/ticketFunctions');

jest.mock('../src/repository/ticketDAO', () => {
    const originalModule = jest.requireActual('../src/repository/ticketDAO');

    return {
        ...originalModule,
        createTicket: jest.fn(),
        queryTicketsByStatus: jest.fn(),
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

    test('submitTicket should return true when trying to submit a ticket', async () => {
        const reqBody = {
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
            description: 'Purchased new office chair',
            amount: 89.99
        }

        const result = await submitTicket(reqBody);

        expect(createTicket).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    test('submitTicket should return false when trying to submit a ticket with missing required parameter(s)', async () => {
        const reqBody = {
            employee_id: '52caac7a-e48f-4587-9eac-c87422f4ba89',
            description: '',
            amount: null
        }

        const result = await submitTicket(reqBody);

        expect(result).toBe(false);
    });

    // test('getTicketsByStatus should return', async () => {
    //     queryTicketsByStatus.mockReturnValue();

    //     const result = getTicketsByStatus();
    // })

})