const sequelize = require("../config/database")
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt")
const crypto = require("crypto");
const User = require("../models/UserModels");
const { throws } = require("assert");


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
            resetTokenExpiration: new Date(),
        };

        try {
            validationSignUp(user);
        } catch (error) {
            return res.status(400).json({ acknowledge: false, message: error.message });
        }

        try {
            const createdUser = await User.create(user);

            if (createdUser) {
                const directLink = `http://localhost:5173/verify/${user.token}`;
                const subject = "Email Verification";
                const text = `<p>Click this link to verify your email: ${directLink}</p>`
                await sendEmail(user, subject, text);
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

//login controller
exports.loginUser = async (req, res) => {
    const email = req.params.email;
    const password = req.params.password
    try {
        console.log("cari email " + email);

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            console.log("email tidak terdaftar");
            return res.status(400).json({ message: "Email tidak terdaftar" })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(400).json({ message: "Password anda salah" })
        }

        if (!user.verification) {
            return res.status(400).json({ message: "Akun belum di verifikasi, link verifikasi sudah dikirimkan ke email" })
        }

        return res.status(200).json({ success: true, message: "Login berhasil" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" })
    }
}

//verification account
exports.verification = async (req, res) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({ where: { token: token } });

        if (!user) {
            return res.status(404).json({ message: "User not found with the provided token" });
        }

        user.verification = true;
        await user.save(); // Save the updated user

        return res.status(200).json({ success: true, message: "User verification successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getStatusVerification = async (req, res) => {
    const token = req.params.token
    try {
        const user = await User.findOne({ where: { token: token } });
        if (user) {
            if (user.verification) {
                res.status(200).json({ verification: true })
            } else {
                res.status(200).json({ verification: false })
            }
        } else {
            res.status(400).json({ verification: false, message: "Token salah" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.forgotPassword = async (req, res) => {
    console.log("okee");
    const { email } = req.body;
    console.log(email);
    try {
        console.log(email);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        //send email
        const directLink = `http://localhost:5173/auth/reset-password/${resetToken}`
        const subject = "Email Reset Password";
        const text = `<p>Click <a href="${directLink}">here</a> to reset your password.</p>`
        try {
            await sendEmail(user, subject, text);
        } catch (error) {
            console.log(error);
        }
        return res.status(200).json({ success: true, message: "Send email reset password successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Temukan pengguna berdasarkan token yang diterima
        const user = await User.findOne({ where: { resetToken: token } });

        if (!user) {
            return res.status(400).json({ acknowledge: false, message: 'Invalid token' });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password pengguna
        await User.update({ password: hashedPassword, resetToken: null }, { where: { id: user.id } });

        return res.status(200).json({ acknowledge: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



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
    } else if (name.length < 3) {
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

const sendEmail = async (user, subject, text) => {
    const mailOptions = {
        from: 'payogot@gmail.com',
        to: user.email,
        subject: subject,
        html: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', user.email);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}