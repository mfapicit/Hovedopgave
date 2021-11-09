const mongoose = require('mongoose')

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