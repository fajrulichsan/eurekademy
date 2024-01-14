const dotenv = require("dotenv")
dotenv.config();
const sequelize = require("../../config/database")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../../models/UserModels");
const Profile = require("../../models/ProfileModels");
const {isRequired, sendTokenViaEmail} = require("../../utils/global")

exports.SignUp = async (req, res) => {
    try {
        const data = req.body;
        data.id = new Date().getTime();

        // check field required
        const {status, message, field} = isRequired(['username', 'email', 'password'], data);
        if(status === "error"){
            return res.status(400).json({status , field, message })
        }

        // validation email
        if(!validator.isEmail(data.email)){
            return res.status(400).json({status : "error" , field : "email", message : "Invalid Email Format", });
        }

        // Check email registered
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) {
            return res.status(400).json({ status: "error", field : "email", message: "Email is already registered" });
        }
        
        // Validation password
        if (!isValidPassword(data.password)) {
            return res.status(400).json({ status: "error", field : "password",  message: "Invalid password format" });
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
        res.status(201).json({ status: "success", message: "User created successfully" });
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

exports.Login = async (req, res) => {
    try {
        const data = req.body;
        const tokenSecret = process.env.TOKEN_SECRET;

        // check required fields
        const { status: requiredStatus, message: requiredMessage, field: requiredField } = isRequired(['email', 'password'], data);
        if (requiredStatus === 'error') {
            return res.status(400).json({ status: requiredStatus, field: requiredField, message: requiredMessage });
        }

        const user = await User.findOne({ where: { email: data.email } });

        // check if user is not registered
        if (!user) {
            console.log("User is not registered");
            return res.status(400).json({ status: 'error', field: 'email', message: 'User is not registered' });
        }

        // check password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', field: 'password', message: 'Invalid password' });
        }

        //token
        const token = jwt.sign({ userId: user.id }, tokenSecret, { expiresIn: '1h' });

        // check user verification status
        if (!user.isVerification) {
            return res.status(400).json({ status: 'error', token: token, message: 'Please verify your account' });
        }


        res.status(200).json({ status: 'success', userId: user.id, token : token, message: 'Login Success' });
    } catch (error) {
        console.error('Error logging in user:', error);
        let errorMessage = 'Error logging in user';

        // Check if the error is a Sequelize validation error
        if (error.name === 'SequelizeValidationError') {
            errorMessage = error.errors.map(err => err.message).join(', ');
        }

        res.status(500).json({ message: errorMessage });
    }
};

exports.verification = async (req, res) => {
    try {
        // Get the verification token from the request parameters or body
        const data = req.body
        const verificationToken = req.params.token || data.token;
        const {status, message, field} = isRequired(['verificationCode', 'token'], data)
        console.log(message);
        if(status === "error"){
            return res.status(400).json({status, field, message})
        }

        // Verify the token
        const decodedToken = jwt.verify(verificationToken, process.env.TOKEN_SECRET);

        // Get the user ID from the decoded token
        const userId = decodedToken.userId;

        // Find the user in the database
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Check if the user is already verified
        if (user.isVerification) {
            return res.status(400).json({ status: 'error', message: 'User is already verified' });
        }

        // Update the user's verification status in the database
        if(user.verificationCode !== data.verificationCode){
            return res.status(400).json({ status: 'error', message: 'Invalid verification code' });
        }else{
            await user.update({ isVerification: true });
        }

        res.status(200).json({ status: 'success', userId : userId, message: 'User verified successfully' });
    } catch (error) {
        console.error('Error verifying user:', error);

        // Handle JWT verification errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ status: 'error', message: 'Invalid verification token' });
        }

        // Handle other errors
        res.status(500).json({ status: 'error', message: 'Error verifying user' });
    }
};

exports.triggerChangePassword = async (req, res) => {
    try {
        const {email} = req.body;

        //check email required
        const {status, message, field} = isRequired(['email'], req.body);
        if(status === "error"){
            return res.status(400).json({status , field, message })
        }

        // check validate email
        if(!validator.isEmail(email)){
            return res.status(400).json({status : "error" , field : "email", message : "Invalid Email Format", });
        }

        //check email registed
        const user = await User.findOne({where : {email}})
        if(!user){
            return res.status(400).json({status : "error", message : "'Email not registered' "})
        }

        //generate jtw
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // send token
        sendTokenViaEmail(email, token);

        res.status(200).json({ status: 'success', message: 'Token sent via email' });
    } catch (error) {
        console.error('Error triggering password change:', error);
        res.status(500).json({ status: 'error', message: 'Error triggering password change' });
    }
}

exports.validateTokenAndUpdatePassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Check required fields
        const { status, message, field } = isRequired(['token', 'newPassword'], req.body);
        if (status === "error") {
            return res.status(400).json({ status, field, message });
        }

        // Validate password format
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ status: 'error', field: 'password', message: 'Invalid password format' });
        }

        try {
            // Verify the token
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

            // Fetch the user from the database based on the decoded token
            const user = await User.findByPk(decodedToken.userId);

            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }

            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password
            await user.update({ password: hashedNewPassword });

            res.status(200).json({ status: 'success', message: 'Password updated successfully' });
        } catch (error) {
            // Handle JWT verification errors
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ status: 'error', message: 'Invalid token' });
            }

            // Handle TokenExpiredError
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ status: 'error', message: 'Token has expired' });
            }

            throw error; // Re-throw other errors
        }
    } catch (error) {
        console.error('Error validating token and updating password:', error);
        res.status(500).json({ status: 'error', message: 'Error validating token and updating password' });
    }
};



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