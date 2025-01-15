const dotenv= require('dotenv');
dotenv.config();
const cors= require('cors');
const express= require('express');
const app= express();
const path= require('path');
const cookieParser= require('cookie-parser');
const {initializeSocket} = require('./socket');
const connectDB= require('./config/database');
const codeRouter = require('./routes/codeRouter');

app.use(cors({
    origin: ['https://devsync-frontend-5b3e.onrender.com'],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());




app.use("/",codeRouter);

const port= process.env.PORT || 3000;

connectDB().then(()=>{
    console.log('Database connected');
    const server= app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    })
    initializeSocket(server);
}).catch((err)=>{
   console.log(err);
})




