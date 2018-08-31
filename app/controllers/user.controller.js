//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------
// including bcrypt for password encryption
var bcrypt = require('bcryptjs');

// exporting user.model.js which runs all the DB functions.
var user = require('../models/user.model.js')
var db = require('../db/db.js')

//----------------------------------------------------------FUNCTIONS----------------------------------------------

// load the home page 
exports.homePage = async function(req, res) {
  res.render('pages/index',req.session.user)
}

// load the signup page
exports.signUpPage = async function(req,res){
  res.render('pages/signup',req.session.user);
}

//POST user information from the SignUp page
exports.signUp = function(req, res) {

  bcrypt.genSalt(10, function(err, salt) {

    bcrypt.hash(req.body.password_hash, salt, function(err, p_hash) { 

      req.body.password_hash = p_hash;
      
      db.pool().query('INSERT INTO users SET ?', 
        req.body,function (error, results, fields) {
        
        if (error){

          //Email already exists - error message
          req.session.user = {error: error.code};
          // req.session.user.error = error.code;
          console.log(req.session.user.error);
          res.render('pages/signup',req.session.user);

        }else{
          delete req.body.password_hash;
          db.pool().query('SELECT * FROM users WHERE email_address = ?', 
            req.body.email_address,function (error, results, fields) {
              if (error){
                console.log('HELLO!!!!');
                
              }else{
                //Create New User account and navigate user to the main profile page
                req.session.user = {userInfo: req.body}; // might have some issue(kit)
                req.session.user.userInfo.id = results[0].id;
                // req.session.useruserInfo.error = null;
                res.render('pages/edit-profile',req.session.user);
              }
            });
        }  
      });
    });
  });
}

exports.login = function( req, res, next ) {

  if (req.body.email_address && req.body.password) {
    user.authenticate(req.body.email_address, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        console.log('inside user.controller.login', user)
        console.log('inside user.controller.login', req.path)
        req.session.user = { 
          userInfo : {  
            id: user.id,
            email_address: req.body.email_address,
            first_name: user.first_name,
            last_name: user.last_name,
          }
        }

        var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
        delete req.session.redirectTo
        return res.redirect(redirectTo)
        //return res.redirect('/');
      }
    })
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

}

exports.logout = function( req, res, next ) {
  if (req.session) {
    // delete session object
    req.session.destroy( function (err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
}

exports.authorize = function( req, res, next ) {
  if (!req.session.user) {
    console.log( 'inside authorize => userInfo is undefined' )
    req.session.redirectTo = req.path;
    return res.redirect('/');
    //return res.redirect('/login');
  } 
  
  user.findByEmail( req.session.userInfo.email_address, function( error, results) {
    if (error) {
      req.session.redirectTo = req.path;
      return res.redirect('/login');  
    } else {
      return next()
    }
  })


}

exports.editProfilePage = function (req, res){
  res.render('pages/edit-profile',req.session.userInfo);
}

exports.editProfile = function (req, res){
  console.log(req.body);
  if (!req.files){
    return res.status(400).send('No files were uploaded.');
  }
  let photoFile = req.files.photourl;
  console.log(photoFile);
  // let fileName = req.session.user.userInfo.id+req.session.user.userInfo.first_name+req.session.user.userInfo.last_name+'';
  // photoFile.mv('../images/', function(err) {
  //   if (err)
  //     return res.status(500).send(err);
 
  //   res.send('File uploaded!');
  // });
  db.pool().query('UPDATE users SET gitlink = ?, linkdin = ?, photourl = ? WHERE id = ?',
    [req.body.gitlink,req.body.linkdin,req.body.photourl], function (err,results,fields){
      if (err){
        console.log(err);
      }else{
        res.render('pages/profile',req.session.user);
      }
    });
}