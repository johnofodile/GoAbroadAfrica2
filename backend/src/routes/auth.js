const router = require("express").Router();
const {register, login, getMe, forgotPassword, resetPassword} = require("../controllers/auth");
router.post('/forgot-password',       forgotPassword);
router.post('/reset-password/:token', resetPassword);

const {protect}=require("../middleware/auth");



router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe); // protected — must be logg
// ed in




module.exports = router;