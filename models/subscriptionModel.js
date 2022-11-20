const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const movies=require('./movieModel')
const subscribers=require('./subscriberModel')


let SubscriptionSchema = new mongoose.Schema({
    subscriberId : {type: Schema.Types.ObjectId,ref: 'subscribers'},
    movies : [{movieId:{type: Schema.Types.ObjectId,ref: 'movies'},date:Date}]
})

module.exports = mongoose.model('subscriptions', SubscriptionSchema);