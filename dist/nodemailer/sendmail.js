"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../core/config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (email, text) => {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: env_1.envs.address_mail,
            pass: env_1.envs.mot_de_passe
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // Email options
    const mailOptions = {
        from: env_1.envs.address_mail,
        to: email,
        subject: '👋 Hello from Node.js 🚀',
        text: text
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Error:', error.message);
        }
        else {
            console.log('✅ Email sent:', info.response);
        }
    });
};
exports.default = sendMail;
//# sourceMappingURL=sendmail.js.map