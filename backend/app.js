const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const certificateRoute = require('./routes/certificateRoute');

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Max-Age', 86400);

    next();
});
// app.use(cors());
app.use(bodyParser.json());

app.use('/certificates', certificateRoute);

module.exports = app;