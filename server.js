//
var path = require('path')
var express = require('express')
const router = express.Router();
var db = require('./app/db/db.js')
var routes = require('./app/routes/routes.js')
var session = require('express-session');

//Create an express app
var app = express()

//create session
app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

//Use req.body
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('views', path.join(__dirname, './app/views/pages')) //what does this do?
//Use ejs templating
app.set('view engine', 'ejs')


//use static folder public
app.use(express.static(path.join(__dirname, 'app/public')))

//connect to the database
db.connect()

//Use routes
app.use('/', routes)

//Server listening on port 3000
app.listen(3000)