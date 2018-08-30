// native modules
var path = require('path')
// npm packages
var express = require('express')
var session = require('express-session');
// local
var db = require('./app/db/db.js')
var routes = require('./app/routes/routes.js')

// create an express app
var app = express()

// create session
app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

// use req.body
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// change default locations for views folder
app.set('views', path.join(__dirname, './app/views'))
// use ejs templating
app.set('view engine', 'ejs')

// use static folder at app/public
app.use(express.static(path.join(__dirname, 'app/public')))

// connect to the database
db.connect()

// use routes
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
  // res.render can also be called here
})

// server listening on port 3000
app.listen(3000)