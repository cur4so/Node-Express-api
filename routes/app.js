const express = require('express');
const csv2json = require("csvtojson");
const processing = require('../lib/processing');

var app = express();

app.get('/organizations', function (req, res) {
    processing.select(res, req.query);
});

module.exports.app = app;
