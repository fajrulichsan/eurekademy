const sequelize = require("../config/database")
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const User = require("../models/UserModels")


//get all User
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

//get user by id
exports.getUserById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Users WHERE id =' + req.params.id;
        const [users, metadata] = await sequelize.query(query);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//add new user
exports.createUser = async (req, res) => {
    try {
        const user = {
            id: new Date().getTime(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            token: uuidv4(),
        };

        try {
            validationSignUp(user);
        } catch (error) {
            return res.status(400).json({ acknowledge: false, message: error.message });
        }

        try {
            const createdUser = await User.create(user);

            if (createdUser) {
                sendEmail(user);
            }

            return res.status(201).json({ acknowledge: true, message: 'Success create user' });
        } catch (error) {
            console.error('Error creating user:', error);

            // Handle database-specific errors
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ acknowledge: false, message: 'Email sudah terdaftar' });
            } else {
                return res.status(500).json({ acknowledge: false, message: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ acknowledge: false, message: error.message });
    }
};


//update user
exports.updateUser = async (req, res) => {
    try {
        await User.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(201).json({ msg: 'Success update user' });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//delete user
exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).json({ msg: 'Success Delete user' });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//validation email
const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

//node mailler
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'payogot@gmail.com',
        pass: 'fmzxtxxurjeymjzg',
    },
});

//validation form
const validationSignUp = (user) => {
    var name = String(user.name).trim();
    var email = String(user.email).trim();
    var password = String(user.password);

    if (name.length == 0) {
        throw Error("Name tidak boleh kosong");
    }else if (name.length < 3){
        throw Error("Password harus memiliki setidaknya 3 karakter")
    }

    if (email.length === 0) {
        throw Error("Email tidak boleh kosong");
    } else if (!isValidEmail(email)) {
        throw Error("Email tidak valid");
    }

    if (password.length === 0) {
        throw Error("Password tidak boleh kosong");
    } else if (password.length < 8) {
        throw Error("Password harus memiliki setidaknya 8 karakter");
    }
}

const sendEmail = async (user) => {
    const verificationLink = `http://localhost:5173/verify/${user.token}`; // Ganti dengan base URL Anda
    const mailOptions = {
        from: 'payogot@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        text: `Click this link to verify your email: ${verificationLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', user.email);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}