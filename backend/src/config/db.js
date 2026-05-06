const mongoose=require('mongoose');


async function connectDB(){
    try{

        const conn= await mongoose.connect(process.env.MONGODB_URI);

    }catch(error){

        console.error('[DB Connection failed:', error.message);
    }
}

module.exports = connectDB;