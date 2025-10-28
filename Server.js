const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
app.listen(3456, () => {
    console.log("Listening to port 3456");
})
app.use(cors());

const connectToMDB = () => {
    try{
        mongoose.connect("mongodb+srv://sai:honey@cluster0.r8k6sfp.mongodb.net/BRNDB?appName=Cluster0")
        console.log("Successfully connected to MDB");
    }
    catch(err){
        console.log("Not connected to MDB");
    }
}

connectToMDB();