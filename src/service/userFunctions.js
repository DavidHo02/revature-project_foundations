const uuid = require('uuid');

const { logger } = require('../util/logger');

const { User } = require('../models/user');
const { createUser, queryUserById, queryUserByUsername, updateUserRole } = require('../repository/userDAO');
const { queryTicketsByUserId } = require('../repository/ticketDAO');

async function registerUser(reqBody) {
    const { username, password } = reqBody;

    // check if username is empty
    if (!username) {
        throw new Error('Could not register: missing username!');
    }

    // check if password is empty
    if(!password) {
        throw new Error('Could not register: missing password!');
    }

    // check if username already exists
    const result = await queryUserByUsername(username);
    
    if(result) {
        throw new Error('Could not register: username already exists');
    }

    const id = uuid.v4();
    const newUser = new User(id, username, password);

    let data = await createUser(/* OBJECT */newUser);
    logger.info(`Added ${newUser.username} with id: ${newUser.employee_id} to database`);

    return true;
}

async function login(reqBody) {
    const { username, password } = reqBody;

    // check if username is empty
    if (!username) {
        throw new Error('Could not login: missing username!');
    }

    // check if password is empty
    if(!password) {
        throw new Error('Could not login: missing password!');
    }

    // check that username exists in the database
    // queryUserByUsername returns false if the username is not in the DB
    const userObj = await queryUserByUsername(username);

    if(!userObj) {
        // the username does not exist in the database
        throw new Error('Could not login: invalid credentials');
    }

    if(password !== userObj.password) {
        // the password does not match the one found in the database
        throw new Error('Could not login: invalid credentials');
    }

    return userObj;
}

async function changeUserRole(userId, newRole) {
    const user = await queryUserById(userId);

    if(!user) {
        throw new Error(`Employee with id: ${userId} does not exist!`);
    }

    const data = await updateUserRole(user, newRole);

    return data;
}

module.exports = {
    registerUser,
    login,
    changeUserRole
}