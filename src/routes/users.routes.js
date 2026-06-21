// src/routes/users.routes.js

/*
ROUTES:
API Address;
Ex. : GET /api/users  -> USERS shlifa
      POST /api/users -> create USER
*/

const express = require("express");
const usersController = require('../controllers/usersController');

const router = express.Router();

/* GET /api/users */
router.get('/', usersController.baseConnection);

// /* POST /api/users */
// router.post("/", usersController.createUser);

/* DELETE /api/users/:userId */
router.delete('/:userId', usersController.removeUser);

module.exports = router;