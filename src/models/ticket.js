class Ticket {
    constructor(id, e_id, desc, amount, r_id = -1, status = 'pending') {
        this.id = id;
        this.employee_id = e_id;
        this.resolver_id = r_id; // default to -1 for no value
        this.description = desc;
        this.amount = parseFloat(amount).toFixed(2);
        this.status = status; // default to pending
    }
}

// console.log(new Ticket(0, 1, 'test', 12.34));

module.exports = {
    Ticket
};