const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/views') })
})

app.listen(port);
console.log('listening at port ' + port);
