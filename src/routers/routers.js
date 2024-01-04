const express = require("express");
const { getAllUser, getUserById, createUser, updateUser, deleteUser} = require("../controllers/UserControllers");
const {getProfileByUserId, updateProfile} = require("../controllers/ProfileController")

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


module.exports = router;