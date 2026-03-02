const jwt= require('jsonwebtoken');
const User = require('../models/User');


// Attach user to req if valid JWT is found

exports.protect= async(req,res,next) =>{

const authHeader = req.headers.authorization;
if(!authHeader  || !authHeader.startsWith('Bearer')){

       return res.status(401).json({ message: 'Not authorised — no token' });
}

try{

const token = authHeader.split(' ')[1];
const decoded=jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');
    //this will go straight to the catch block
    next();


}
catch(err){

    res.status(401).json({ message: 'Token invalid or expired' });
}


};

exports.adminOnly= (req,res,next)=>{
    if(req.user)

}