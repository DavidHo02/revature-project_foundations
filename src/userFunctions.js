const uuid = require('uuid');

const { User } = require('./models/user');
const { createUser, queryUserByUsername } = require('./userDAO');

// working so far
async function registerUser(username, password) {
    // check if username or password are empty
    if(!username || !password) {
        console.error('username or password is empty!');
        return;
    }

    // check if username already exists
    if(queryUserByUsername(username)) {
        console.log(`${username} already exists!`);
        return;
    }


    let id = uuid.v4();
    const newUser = new User(id, username, password);

    let data = await createUser(/* OBJECT */newUser);
    // console.log(data);
}

module.exports = {
    registerUser,
}

// registerUser('david', 'test123');