class User {
    constructor(id, username, pass, /* role = 'Employee' */) {
        /**
         * employee_id is the partition key
         * join_date is the sort key (also known as range key)
         * Together, employee_id and join_date make up a composite primary key
         * https://dynobase.dev/dynamodb-sort-key/
         */
        this.employee_id = id;
        this.join_date = Math.floor(new Date().getTime() / 1000);

        this.username = username;
        this.password = pass;
        this.role = 'Employee';
    }
}

// console.log(new User(0, 'test', 'testpass'));
// OUTPUT:
// User {
//     employee_id: 0,
//     join_date: 1726672181,
//     username: 'test',
//     password: 'testpass',
//     role: 'Employee'
//   }

module.exports = {
    User
};