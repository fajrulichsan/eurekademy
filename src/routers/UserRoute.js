const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, 
        deleteUser, loginUser, verification, getStatusVerification, 
        forgotPassword, resetPassword} = require("../controllers/UserControllers");

const router = express.Router();

//sign up
router.get("/user", getAllUser)
router.get("/user/:id", getUserById)
router.post("/user", createUser)
router.patch("/user/:id", updateUser)
router.delete("/user/:id", deleteUser)

//login
router.post("/user/:email/:password", loginUser)

//verication
router.get("/verify/:token", getStatusVerification)
router.post("/verify/:token", verification)

//reset password
router.post("/auth/forgot-password", forgotPassword )
router.post("/auth/reset-password", resetPassword )

module.exports = router;