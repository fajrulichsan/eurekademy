// utils.js
const nodemailer = require("nodemailer")

const root = "http://localhost:3000"
function isRequired(fields, data) {
    for (const field of fields) {
        if (!data[field]) {
            return { status : "error" , field : field, message : `${field} is required` }
        }
    }
    return {status : "success", message : "All required fields are present"}
}

function sendTokenViaEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fajrulichsan0208@gmail.com',
            pass: 'cbqo xzje oepv eoxx',
        },
    });

    const mailOptions = {
        from: 'eurekademy@gmail.com',
        to: email,
        subject: 'Password Change Request',
        text: `${root}/auth/forgot-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = {
    isRequired,
    sendTokenViaEmail
};
