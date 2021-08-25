const express = require('express');
const server = express();

server.get('/', function (req, res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('sqlut q tus');
});

server.listen(3000, function () {
    console.log('server en ceoute')
});