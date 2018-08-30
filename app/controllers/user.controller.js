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

//Load the home page and initialize the userInfo session object
exports.homePage = async function(req, res) {

  if (req.session.userInfo){ 
    res.render('index',req.session.userInfo);
    
  }else{
      req.session.userInfo = {
      first_name: null,
      last_name: null,
      username: null,
      email_address: null
    };
    res.render('index',req.session.userInfo);
  } 
}

//Load the SignUp page
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

//POST user information from the SignUp page
exports.signUp = function(req, res) {

  bcrypt.genSalt(10, function(err, salt) {

    bcrypt.hash(req.body.password_hash, salt, function(err, p_hash) { 

      req.body.password_hash = p_hash;
      
      db.pool().query('INSERT INTO users SET ?', 
        req.body,function (error, results, fields) {
        
        if (error){

          //Username already exists - error message
          console.log(error);

        }else{
          delete req.body.password_hash;
          db.pool().query('SELECT * FROM users WHERE username = ?', 
            req.body.username,function (error, results, fields) {
              if (error){
                console.log(error);
              }else{
                //Create New User account and navigate user to the main profile page
                req.session.userInfo = req.body;
                req.session.userInfo.id = results[0].id;
                res.render('edit-profile',req.session.userInfo);
              }
            });
        }  
      });
    });
  });
}

exports.editProfilePage = function (req, res){
  res.render('edit-profile',req.session.userInfo);
}

exports.editProfile = function (req, res){
  db.pool().query('UPDATE users SET gitlink = ?, linkdin = ?, photourl = ? WHERE id = ?',
    [req.body.gitlink,req.body.linkdin,req.body.photourl], function (err,results,fields){
      if (err){
        console.log(err);
      }else{
        res.render('profile',req.session.userInfo);
      }
    });
}