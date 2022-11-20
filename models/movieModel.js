const mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
    name : String,
    genres : [String],
    imageUrl :String, 
    //{type: String, default: "https://static.tvmaze.com/uploads/images/medium_portrait/0/1389.jpg"} 
    premiered: Date
})

module.exports = mongoose.model('movies', MovieSchema);

