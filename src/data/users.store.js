// src/data/users.store.js

/*
    Temporary in-memory "database".

    ⚠️
    - This is only for POC.
    - Data disappears when server restarts.
    - Later, replace this file with MongoDB / SQL / JSON DB adapter.
*/

const users = [] ;

/*  Helper: Do not return passwords to the client. */
function hidePassword(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}

/* READ all users */
function getAllUsers() {
    return users.map(hidePassword);
}

/* READ one user by username */
function getUserByUsername(username) {
    return users.find(
        (user) => user.username.toLowerCase() === username.toLowerCase()
    );
}

/* CREATE Student user */
function createUser({ username, password }) {
    const newUser = {
        id: `user_${Date.now()}`,
        username,
        password,
        role: "student",
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    return hidePassword(newUser);
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser
};

/*
users.store.js = Temp Data Layer
- controller doesnt need to know how to save
- we save arr in mem etm
- future switch DB w/o change whole Server logic use
*/