const mongoose = require('mongoose');

let SubscriberSchema = new mongoose.Schema({
    name : String,
    email : String,
    city : String
})

module.exports = mongoose.model('subscribers', SubscriberSchema);

