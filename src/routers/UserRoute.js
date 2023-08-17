const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, deleteUser} = require("../controllers/UserControllers");

const router = express.Router();
router.get("/user", getAllUser )
router.get("/user/:id", getUserById )
router.post("/user", createUser )
router.patch("/user/:id", updateUser)
router.delete("/user/:id", deleteUser)

module.exports = router;