const uuid = require('uuid');

const { logger } = require('../util/logger');

const { User } = require('../models/user');
const { createUser, queryUserByUsername } = require('../repository/userDAO');

async function registerUser(username, password) {
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
    // queryUserByUsername returns false if the username is not in the DB
    const userObj = await queryUserByUsername(username);
    if(!userObj) {
        // the username does not exist in the database
        return false;
    }

    // now that we know the username exists in the database, check the password
    if(password === userObj.password) {
        return userObj;
    } else {
        return false;
    }
}

module.exports = {
    registerUser,
    login
}