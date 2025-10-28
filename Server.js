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