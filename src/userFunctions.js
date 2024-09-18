const uuid = require('uuid');

const { User } = require('./models/user');
const { createUser } = require('./userDAO');

// working so far
async function registerUser(username, password) {
    let id = uuid.v4();
    const newUser = new User(id, username, password);

    let data = await createUser(/* OBJECT */newUser);
    // console.log(data);
}

module.exports = {
    registerUser,
}

// registerUser('david', 'test123');