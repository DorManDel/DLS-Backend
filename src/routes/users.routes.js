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

router.post('/signup', usersController.getSignupPost);

router.post("/login", usersController.getLoginPost);
// /* POST /api/users */
// router.post("/", usersController.createUser);

/* DELETE /api/users/:userId */
router.delete('/:userId', usersController.removeUser);

router.get("*/path", (req,res) => {
      console.log("Incorrect route");
      return res.status(404).json({message: "incorrect path" , success: false});     
})

module.exports = router;