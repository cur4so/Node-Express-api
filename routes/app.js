const express = require('express');
const config = require('../config.json');
const processing = require('../lib/processing');

const app = express();

app.get('/organizations', function (req, res) {
    processing.select(res, req.query, config.default);
});

app.get('/organizations/:id', function (req, res) {
    var path = config[req.params.id];
    if (typeof path === 'undefined'){
        res.send('wrong id')
    }
    else {
        processing.select(res, req.query, path);
    }
});

module.exports.app = app;
