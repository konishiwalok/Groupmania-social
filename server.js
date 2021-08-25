const express = require('express');
const server = express();
const bodyParser = require('body-parser');

const apiRouter = require('./api-router').router;

//initiali server
const server = express();

//bodyparser config
server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

//configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('sqlut q tus');
});
server.use('/api', apiRouter);
//launch server
server.listen(3000, function () {
    console.log('server en ceoute')
});