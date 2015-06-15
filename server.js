'use strict';
var express = require('express');
var app = express();
var build = '/public';
var cors = require('cors');
var port = process.env.PORT || 3000;
var compression = require('compression');

app.use(cors());
app.use(compression());
app.use(express.static(__dirname + build));

app.listen(port);
console.log('server started on local host port:', port);
