var express = require('express')

var db = require('./app/db/db.js')
var routes = require('./app/routes/routes.js')

var app = express()

db.connect()

app.use('/', routes)

app.listen(3000)