var path = require('path')
var express = require('express')

var db = require('./app/db/db.js')
var routes = require('./app/routes/routes.js')

var app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './app/views'))

db.connect()

app.use(express.static(path.join(__dirname, 'app/public')))

app.use('/', routes)

app.listen(3000)