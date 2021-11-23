const mongoose = require('mongoose')

// Schema for saved profiles
const profileSchema = new mongoose.Schema({
    utNumber: String,
    dato: String,
    godsType: String,
    vognLitra: String,
    axleDistance: Number,
    axleDistanceInBoogie: Number,
    axleCount: Number,
    godsLenght: Number
})

module.exports = mongoose.model('Profile', profileSchema)