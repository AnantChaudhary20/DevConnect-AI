const nodemailer = require("nodemailer");

const getTransporter = () => {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT || 587);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!host || !user || !pass) throw new Error("Email service is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS.");
    return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
};

const sendVerificationCode = async (email, name, code) => {
    await getTransporter().sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: "Verify your DevConnect AI email address",
        text: `Hi ${name}, your DevConnect AI verification code is ${code}. It expires in 15 minutes.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>Verify your DevConnect AI email</h2><p>Hi ${name},</p><p>Your verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px;background:#f3f4f6;border-radius:12px;text-align:center">${code}</div><p>This code expires in 15 minutes.</p></div>`
    });
};

module.exports = { sendVerificationCode };
