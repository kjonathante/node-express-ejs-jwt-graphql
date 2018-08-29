//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------
// var express = require('express')
// var app = express();
// const bodyParser = require('body-parser');
//Exporting user.model.js which runs all the DB functions.
var user = require('../models/user.model.js')
// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

const db = require('../db/db.js')

//Including bcrypt for password encryption
var bcrypt = require('bcryptjs');

//Allow sessions
// var session = require('express-session');


//----------------------------------------------------------VARIABLES----------------------------------------------

// var userSession={
//   session: 'logged_out',
//   data: null
// };


//----------------------------------------------------------FUNCTIONS----------------------------------------------

exports.homePage = async function(req, res) {
  console.log(req.session.userInfo);
  if (req.session.userInfo){
    console.log('Hello',req.session); 
    res.render('index',req.session.userInfo);
    
  }else{
    
      req.session.userInfo = {
      first_name: null,
      last_name: null,
      username: null,
      email_address: null
    };
    console.log('Hellox',req.session); 
    res.render('index',req.session.userInfo);
  }
  
}

exports.signUpPage = async function(req,res){
  res.render('signup',req.session.userInfo);
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

exports.signUp = function(req, res) {
  // console.log(req.session);
  bcrypt.genSalt(10, function(err, salt) {

    bcrypt.hash(req.body.password_hash, salt, function(err, p_hash) { 

      req.body.password_hash = p_hash;
      
      db.pool().query('INSERT INTO users SET ?', 
        req.body,function (error, results, fields) {
        
        if (error){
          //Username already exists - error message
          console.log(error);
          // res.render('signup',error);

        }else{
          //Create New User account and navigate user to the main profile page
          // console.log(req.body.first_name);
          delete req.body.password_hash;
          // req.session={};
          req.session.userInfo = req.body;
          console.log(req.session.userInfo);
          // userSession.session = req.session.firstName;
          // userSession.data = results[0];
          res.render('edit-profile',req.session.userInfo);
          // res.render('edit-profile',req.body);

        }  
      });
    });
  });
}