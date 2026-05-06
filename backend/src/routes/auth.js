const router = require("express").Router();
const {register, login, getMe}= require("../controllers/experiences/auth");
const {protect}=require("../middleware/auth");



router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe); // protected — must be logged in



module.exports = router;