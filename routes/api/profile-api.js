const express = require('express')
const router = express.Router()
const controller = require('../../controllers/profile-controller')

// ENDPOINTS

router
    .post('/profiles', postEndpoint)


// Endpoint callback functions

// post Endpoint to create new profile
async function postEndpoint(req, res, next) {
    await controller
        .create(req.body)
        .then((result) => {
            res.status(201).send(result)
        })
        .catch(next)
}


module.exports = router

