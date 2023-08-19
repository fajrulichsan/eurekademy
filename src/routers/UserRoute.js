const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, deleteUser, loginUser, verification} = require("../controllers/UserControllers");

const router = express.Router();

//sign up
router.get("/user", getAllUser )
router.get("/user/:id", getUserById )
router.post("/user", createUser )
router.patch("/user/:id", updateUser)
router.delete("/user/:id", deleteUser)

//login
router.post("/user/:email/:password", loginUser)

//verication
router.post("/verify/:token", verification)

module.exports = router;