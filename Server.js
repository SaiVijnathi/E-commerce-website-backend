const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const User = new mongoose.model("users",userSchema,"users");

app.post("/signup", async (req,res) => {
    try{
        console.log(req.body);
        const userData = req.body;
        await User.insertMany(userData)
        console.log("Successfully signuped up");
        res.json({status:"singup successful"});
    }
    catch(err){
        console.log("Not signedup",err)
    }
})

app.post("/login", async (req,res) => {
    try{
        console.log(req.body);
        const userArr = await User.find({email:req.body.email});
        console.log(userArr)
        if(userArr.length > 0){
            if(req.body.password === userArr[0].password){
                console.log("login successful")
                res.json({status:"success", msg: "login successful"})
            }else{
                console.log("password is incorrect");
                res.json({status:"password is not correct"})
            }}
        else{
            console.log("email doesnt exist");
            res.json({status:"email doesnt exist"})
        }
        
    }catch(err){
        console.log("Not logged in",err)
    }
})

const connectToMDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Successfully connected to MDB");
    }
    catch(err){
        console.log("Not connected to MDB",err);
    }
}

connectToMDB();