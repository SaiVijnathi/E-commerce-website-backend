const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require("multer")

// dotenv.config();

const app = express();
app.listen(3456, () => {
    console.log(`Listening to port 8888`);
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//User Schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role: {
        type: String,
        enum: ["admin", "vendor", "customer"],
        required : true
  }
});

const User = new mongoose.model("users",userSchema,"Users");

//Items Schema
const itemSchema = new mongoose.Schema({
    itemName : {
        type : String,
        required : true
    },
    modelName : {
        type : String,
        required : true
    },
    itemCount : {
        type : Number,
        required : true
    },
    itemPicture : {
        type : String,
        required : true
    },
    itemCost : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    }
});

const Item = new mongoose.model("items", itemSchema, "Items")

app.post("/signup", async (req,res) => {
    try{
        console.log(req.body);
        const userData = req.body;
        await User.insertMany(userData);
        console.log("Successfully signuped up");
        res.json({status:"success", msg:"singup successful"});
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
                let token = jwt.sign({email : req.body.email, password : req.body.password, role : req.body.role}, "jwt_secret_key");
                res.json({status:"success", msg: "login successful", token : token, data : userArr});
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

app.post("/sellitems", upload.single("image"), async (req, res) => {
  console.log("Received body:", req.body);
  console.log("Received file:", req.file);
    try{
        let itemData = {
        itemName : req.body.itemName,
        modelName : req.body.modelName,
        itemCount : req.body.itemCount,
        itemPicture : req.file.path,
        itemCost : req.body.itemCost
    }
    await Item.insertMany(itemData);
    console.log("Item data is stored in DB successfully");
    res.json({status:"success", msg:"Item data is stored in DB successfully", data: req.body, file: req.file})
    }catch(err){
        console.log("Item data is not stored DB");
        res.json({status:"fail", msg:"Item data is not stored."})
    }
});

app.get("/getItemData", async (req,res) => {
    try{
        let itemsData = await Item.find();
        res.json({status:"success", msg:"Retreived data from DB", data : itemsData})
    }catch(err){
        res.json({status:"failure", msg:"Data not retrieved"})
    }
})

app.post('/verifytoken', async (req,res) => {
    console.log(req.body);
    let {token} = req.body;
    let decodedToken = jwt.verify(token, "jwt_secret_key");
    let email = decodedToken.email;
    let itemData = await Item.find({email});
    console.log(itemData)
})

// app.get('/', async (req,res) => {
//     res.send("Server is working fine.");
// })


const connectToMDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://sai:honey@cluster0.r8k6sfp.mongodb.net/BRNDB?appName=Cluster0");
        console.log("Successfully connected to MDB");
    }
    catch(err){
        console.log("Not connected to MDB",err);
    }
}

connectToMDB();