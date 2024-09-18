const uuid = require('uuid');

const { logger } = require('../src/util/logger');

const { User } = require('./models/user');
const { createUser, validateUser, queryUserByUsername } = require('./userDAO');

// working so far
async function registerUser(username, password) {
    
    // queryUserByUsername returns a promise

    // check if username already exists
    const result = await queryUserByUsername(username);
    // console.log(result);
    if(result) {
        return false;
    }

    let id = uuid.v4();
    const newUser = new User(id, username, password);

    let data = await createUser(/* OBJECT */newUser);
    logger.info(`Added ${newUser.username} with id: ${newUser.employee_id} to database`);

    return true;
}

async function login(username, password) {
    // check that username exists in the database
    const result = await queryUserByUsername(username);
    if(!result) {
        // the username does not exist in the database
        return false;
    }

    // now that we know the username exists in the database, check the password
    if(password === result.password) {
        return result.role;
    } else {
        return false;
    }
}

module.exports = {
    registerUser,
    login
}

// registerUser('david', 'test123');