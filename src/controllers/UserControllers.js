// import User from '../models/UserModels.js'
const sequelize = require("../config/database")
const bcrypt = require("bcrypt")
const User = require("../models/UserModels");
const Profile = require("../models/ProfileModels");

exports.getAllUser = async (req, res) => {
   try {
    const query = 'SELECT * FROM Users order by updatedAt desc '; 
    const [users, metadata] = await sequelize.query(query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) =>{
    try{
        const query = 'SELECT * FROM Users WHERE id =' + req.params.id; 
        const [users, metadata] = await sequelize.query(query);
        res.status(200).json(users); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.createUser = async (req, res) => {
    try {
        const data = req.body;
        data.id = new Date().getTime();

        // Check email registered
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) {
            return res.status(400).json({ status: "Error", message: "Email is already registered" });
        }

        // Validation password
        if (!isValidPassword(data.password)) {
            return res.status(400).json({ status: "Error", message: "Invalid password format" });
        }

        data.password = await bcrypt.hash(data.password, 10);
        data.verificationExpired = new Date();
        data.verificationCode = generateVerificationCode();

        // insert to table user
        const userCreated = await User.create(data);


        // insert to table profile
        const profileData = {
            id : new Date().getTime(),
            userId : userCreated.id,
            email : data.email,
            username : data.username
        }

        await Profile.create(profileData)
        res.status(201).json({ status: "Success", message: "User created successfully" });
    } catch (error) {
        console.error('Error creating user:', error);
        let errorMessage = 'Error creating user';

        // Check if the error is a Sequelize validation error
        if (error.name === 'SequelizeValidationError') {
            errorMessage = error.errors.map(err => err.message).join(', ');
        }

        res.status(500).json({ message: errorMessage });
    }
};

exports.updateUser = async (req, res) =>{
    try{
        await User.update(req.body, {
            where : {
                id : req.params.id
            }
        })
        res.status(201).json({msg : 'Success update user'}); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteUser = async (req, res) =>{
    try{
        await User.destroy({
            where : {
                id : req.params.id
            }
        })
        res.status(201).json({msg : 'Success Delete user'}); 
    }catch (error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function generateVerificationCode() {
    const min = 100000; // Nilai minimum untuk 6 digit angka
    const max = 999999; // Nilai maksimum untuk 6 digit angka
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isValidPassword(password) {
    // Validasi password dengan menggunakan ekspresi reguler (regex)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}