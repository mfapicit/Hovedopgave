const mongoose = require('mongoose')

// Schema for saved profiles
const profileSchema = new mongoose.Schema({
    utNumber: Number,
    dato: String,
    godsType: String,
    vognLitra: String,
    axleDistance: Number,
    axleDistanceInBoogie: Number,
    axelCount: Number
})

module.exports = mongoose.model('Profile', profileSchema)