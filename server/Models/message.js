const mongoose = require('mongoose');   

const message = new mongoose.Schema({
    name:String,
    message:String
});

const MessageSchema = mongoose.model('Message', message);
module.exports = MessageSchema;