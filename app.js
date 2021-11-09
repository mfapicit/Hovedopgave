const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/testDB', { useNewUrlParser: true,useUnifiedTopology:true})

app.use(express.json())

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/views') })
})
    .use('/api', require('./routes/api/profile-api'))

app.listen(port)
console.log('listening at port ' + port)
