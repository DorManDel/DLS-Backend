// src/routes/users.routes.js

/*
ROUTES:
API Address;
Ex. : GET /api/users  -> USERS shlifa
      POST /api/users -> create USER
*/

const express = require("express");
const usersController = require("../controllers/users.controller");

const router = express.Router();

/* GET /api/users */
router.get("/", usersController.getUsers);

/* POST /api/users */
router.post("/", usersController.createUser);

module.exports = router;