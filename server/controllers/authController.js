const authService = require("../services/authService");

const signup = async (req, res, next) => { try { const user = await authService.signup(req.body); return res.status(201).json({ success: true, message: "Account created. Please verify your email.", user }); } catch (error) { next(error); } };
const login = async (req, res, next) => { try { const result = await authService.login(req.body); return res.status(200).json({ success: true, message: "Login successful", ...result }); } catch (error) { next(error); } };
const verifyEmail = async (req, res, next) => { try { const result = await authService.verifyEmail(req.body.email, req.body.code); return res.status(200).json({ success: true, ...result }); } catch (error) { next(error); } };
const resendVerification = async (req, res, next) => { try { const result = await authService.resendVerification(req.body.email); return res.status(200).json({ success: true, ...result }); } catch (error) { next(error); } };

module.exports = { signup, login, verifyEmail, resendVerification };
