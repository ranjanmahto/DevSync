const mongoose= require('mongoose');

const connectDB= async()=>{
    await mongoose.connect(`mongodb+srv://ranjanmahto90:${process.env.DATABASE_PASSWORD}@devtinder.ra4vd.mongodb.net/collabIt`)
}

module.exports= connectDB;