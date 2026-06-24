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
router.get('/', usersController.getallusers);

/* POST /api/users/signup */
router.post('/signup', usersController.getSignupPost);

/* POST /api/users/login */
router.post('/login', usersController.getLoginPost);

router.put('/edit' , usersController.editUser)

/* DELETE /api/users/:userId */
router.delete('/:userId', usersController.removeUser);

module.exports = router;