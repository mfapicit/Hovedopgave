const Profile = require('../models/profile-model')

/**
 * @param {Object} data of the new profile
 * @returns {Object} new created Profile
 */
exports.create = async function (data) {
    return await Profile.create(data)
}

/**
 * @param {Number} utNumber 
 * @returns {Object} if utNumber exsist in the Database
 */
exports.getByUTNumber = async function (utNumber) {
    return await Profile.findOne().where('utNumber').eq(utNumber).exec()
}

exports.findOneAndUpdate = async function (utNumber, data) {
    const profileToUpdate = await getByUTNumber(utNumber)
    id = profileToUpdate._id

    return await Profile.findByIdAndUpdate(id, data, { new: true }).exec()

}