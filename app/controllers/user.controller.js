//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------
var express = require('express')
var app = express();
//Exporting user.model.js which runs all the DB functions.
var user = require('../models/user.model.js')

//Including body parser for post calls
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Including bcrypt for password encryption
var bcrypt = require('bcryptjs');

//Allow sessions
var session = require('express-session');
app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));

//----------------------------------------------------------VARIABLES----------------------------------------------

var userSession={
  session: 'logged_out',
  data: null
};


//----------------------------------------------------------FUNCTIONS----------------------------------------------

exports.homePage = async function(req, res) {
  // res.send('Hello')
  res.render('pages/index',userSession);
}

exports.signUpPage = async function(req,res){
  res.render('pages/signup',userSession);
}

exports.getAll = async function(req, res, next) {
  var results
  try {
    results = await user.getAll()
  } catch (error) {
    res.send('Ops')
    throw error
  }
  res.render('pages/index',results[0]) 
} 

exports.signUp = async function(req, res) {
  console.log(req.body);
  bcrypt.genSalt(10, function(err, salt) {

    bcrypt.hash(req.body.password, salt, function(err, p_hash) { 

      req.body.password = p_hash;
      
      connection.query('INSERT INTO users SET ?', 
        req.body,function (error, results, fields) {
        
        if (error){
          //Username already exists - error message
          res.render('pages/signup',error);

        }else{
          //Create New User account and navigate user to the main profile page
          req.session.firstName = results[0].first_name;
          userSession.session = req.session.firstName;
          userSession.data = results[0];
          res.render('pages/edit-profile',userSession);

        }  
      });
    });
  });
}