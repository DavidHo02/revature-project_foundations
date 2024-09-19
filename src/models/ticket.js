const uuid = require('uuid');

class Ticket {
    constructor(e_id, desc, amount, r_id = -1, status = 'pending') {
        this.ticket_id = uuid.v4();
        this.creation_date = Math.floor(new Date().getTime() / 1000);
        this.employee_id = e_id;
        this.resolver_id = r_id; // default to -1 for no value
        this.description = desc;
        this.amount = parseFloat(amount).toFixed(2);
        this.status = status; // default to pending
    }
}

// console.log(new Ticket('52caac7a-e48f-4587-9eac-c87422f4ba89', 'test', 12.34));

module.exports = {
    Ticket
};