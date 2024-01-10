const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, deleteUser} = require("../controllers/UserControllers");
const {getProfileByUserId, updateProfile} = require("../controllers/ProfileController")
const {SignUp, Login, verification, triggerChangePassword, validateTokenAndUpdatePassword} = require("../controllers/auth/AuthController")
const {searchUserByEmailOrUsername} = require("../controllers/tryout/Utils");

const router = express.Router();

// Table User Route
router.get("/users", getAllUser )
router.get("/users/:id", getUserById )
router.post("/users", createUser )
router.patch("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)

// Table Profile Router
router.get("/profile/:userId", getProfileByUserId);
router.put("/profile/:userId", updateProfile);


//auth
router.post("/auth/sign-up", SignUp);
router.post("/auth/login", Login)
router.post("/auth/verification", verification )
router.post("/auth/forgot-password", triggerChangePassword)
router.post("/auth/change-password", validateTokenAndUpdatePassword)

//tryout
router.get("/search-user/:search", searchUserByEmailOrUsername )

module.exports = router;