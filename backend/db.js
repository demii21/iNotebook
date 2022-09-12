const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/"

const connectToMongo = async () => {
    mongoose.connect(mongoURI,() => {
        console.log("Connect to Mongo Successfully");
    })
}

module.exports = connectToMongo;