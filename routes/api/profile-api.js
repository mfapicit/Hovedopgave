const express = require('express')
const router = express.Router()
const controller = require('../../controllers/profile-controller')

// ENDPOINTS

router
    .post('/profiles', postEndpoint)
    .get('/profiles/:utNumber', getFromUTEndpoint)


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

// Get endpoint to get a profile from it's UT number
async function getFromUTEndpoint(req, res, next) {
    await controller
        .getByUTNumber(req.params.utNumber)
        .then((result) => {
            if(!result) res.send({}) // Denne metode skal oftes ikke returnere noget, derfor en grim, men funktionel løsning, for at det kan lykkes
            else res.status(200).send(result)
        })
        .catch(next)
}


module.exports = router

