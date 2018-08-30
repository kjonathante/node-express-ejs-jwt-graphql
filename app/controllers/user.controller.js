//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------
// including bcrypt for password encryption
var bcrypt = require('bcryptjs');

// exporting user.model.js which runs all the DB functions.
var user = require('../models/user.model.js')
var db = require('../db/db.js')

//----------------------------------------------------------FUNCTIONS----------------------------------------------

// load the home page 
exports.homePage = async function(req, res) {
  res.render('pages/index',req.session.userInfo)
}

// load the signup page
exports.signUpPage = async function(req,res){
  res.render('pages/signup',req.session.userInfo);
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
          db.pool().query('SELECT * FROM users WHERE email_address = ?', 
            req.body.email_address,function (error, results, fields) {
              if (error){
                console.log(error);
              }else{
                //Create New User account and navigate user to the main profile page
                req.session.userInfo = req.body; // might have some issue(kit)
                req.session.userInfo.id = results[0].id;
                res.render('pages/edit-profile',req.session.userInfo);
              }
            });
        }  
      });
    });
  });
}

exports.editProfilePage = function (req, res){
  res.render('pages/edit-profile',req.session.userInfo);
}

exports.editProfile = function (req, res){
  db.pool().query('UPDATE users SET gitlink = ?, linkdin = ?, photourl = ? WHERE id = ?',
    [req.body.gitlink,req.body.linkdin,req.body.photourl], function (err,results,fields){
      if (err){
        console.log(err);
      }else{
        res.render('pages/profile',req.session.userInfo);
      }
    });
}