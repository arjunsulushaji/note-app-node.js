const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const connectDB = async()=>{
    try{
        const con  = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected ${con.connection.host}`);
    } catch(error){
        console.log(error);
    }
}

module.exports = connectDB;