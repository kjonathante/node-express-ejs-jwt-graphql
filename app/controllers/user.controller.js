//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------
// native
var path = require('path')
// npm
// including bcrypt for password encryption
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
// local
// exporting user.model.js which runs all the DB functions.
var user = require('../models/user.model.js')
var gitrepo = require('../models/gitrepo.model.js')
var db = require('../db/db.js')

var config = require('../conf/config.js');
email = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ucodebook@gmail.com',
    pass: 'codeBook1#3'
  }
});

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
  console.log(config);
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
                //Create New User account, send email and navigate user to the main profile page
                req.session.user = { userInfo: req.body }
                req.session.user.userInfo.id = results[0].id;

                console.log(results[0].email_adderess);
                //send confirmation email

                let mailOptions = {
                  from: 'ucodebook@gmail.com',
                  to: results[0].email_address,
                  subject: 'Sending Email using Node.js',
                  text: 'Hi, '+results[0].first_name+'\nThat was easy!. Your account is created.'
                };
                email.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

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
  if (!req.session.user || !req.session.user.userInfo) {
    console.log( 'inside authorize => userInfo is undefined' )
    req.session.redirectTo = req.path;
    return res.redirect('/');
    //return res.redirect('/login');
  } 
  
  user.findByEmail( req.session.user.userInfo.email_address, function( error, results) {
    if (error) {
      req.session.redirectTo = req.path;
      return res.redirect('/login');  
    } else {
      return next()
    }
  })


}

exports.editProfilePage = function (req, res, next){
  var id = req.session.user.userInfo.id
  user.findById( id, function(error,userInfo) {
    if (error) {
      return next(error)
    } else {
      gitrepo.findByUserId(id, function(error,userGitRepos){
        if (error) {
          return next(error)
        } else {
          console.log('Inside editProfilePage -> userGitRepos ', userGitRepos)
          userInfo.git_repo = userGitRepos
    
          console.log('Inside editProfilePage -> userInfo ', userInfo)
          return res.render('pages/edit-profile', {userInfo: userInfo} );    
        }
      })
    }
  })
}

exports.editProfile = function (req, res, next){
  console.log('Inside editProfile -->> req.body',req.body)
  console.log('Inside editProfile -->> req.files',req.files);


  // if (!req.files){
  //   return res.status(400).send('No files were uploaded.');
  // }
  // let ext = req.files.photourl.name.split('.');
  // console.log(ext[1]);

  // let photoFile = req.files.photourl;
  // let fileName = req.session.user.userInfo.id+"_"+req.session.user.userInfo.first_name+"_"+req.session.user.userInfo.last_name+"."+ext[1];
  // photoFile.mv(path.join(__dirname,'../public/images/')+fileName, function(err) {
  //   if (err)
  //     return res.status(500).send(err);
 
  //   res.send('File uploaded!');
  // });
  // db.pool().query('UPDATE users SET gitlink = ?, linkdin = ?, photourl = ? WHERE id = ?',
  //   [req.body.gitlink,req.body.linkdin,fileName], function (err,results,fields){
  //     if (err){
  //       console.log(err);
  //     }else{
  //       res.render('pages/profile',req.session.user);
  //     }
  // })

  var fileName = ""
  var id = req.session.user.userInfo.id


  if (req.files) {
    var ext = req.files.photourl.mimetype.split('/')[1]
    console.log('Inside editProfile -->> ext', ext)

    var photoFile = req.files.photourl
    fileName = req.session.user.userInfo.id+"_"+req.session.user.userInfo.first_name+"_"+req.session.user.userInfo.last_name+"."+ext;
    photoFile.mv(path.join(__dirname,'../public/images/')+fileName, function(err) {
      if (err) {
        return next(err)
      }
    });
  }

  var userInfo = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gitlink: req.body.gitlink,
    linkedin: req.body.linkedin,
    photourl: fileName,
  }

  user.update( id, userInfo, function (error, results) {
    if (error) {
      return res.render( 'pages/edit-profile', {error: error, userInfo: userInfo} )
    }
    // save req.body.git_repo
    for( var val of req.body.git_repo ) {
      gitrepo.insert(id, val, function(err, result) {
        if (err) return next(err)
      })
    }

    res.redirect('/profile/' + id )
  })
}

exports.profile = function(req, res, next) {
  console.log('Inside user.controller.profile ==> param.id: ', req.params.id)
  user.findById( req.params.id, function(error,userInfo) {
    if (error) {
      return res.render('pages/profile')
      // return next(error)
    } else {
      gitrepo.findByUserId( req.params.id, function(error,userGitRepos){
        if (error) {
          return next(error)
        } else {
          userInfo.git_repos = userGitRepos
    
          console.log('Inside user.controller.profile -> userInfo: ', userInfo)
          return res.render('pages/profile', {userInfo: userInfo} );    
        }
      })
    }
  })
}


exports.search = function(req,res){

  if(!(/\s/g.test(req.query.searchTerm)) && (/@/g.test(req.query.searchTerm))){
    console.log('this is an email address');
    //do email DB search
    user.findByEmail(req.query.searchTerm,function(error, results){
      if (error){
        console.log(error);
        return (error);
      }else{
        console.log(results.id, results.first_name, results.last_name, req.query.searchTerm);
        return res.render('pages/search',{
          results: [{id:results.id,first_name:results.first_name,last_name:results.last_name}],
          searchTerm: req.query.searchTerm
        });
      }
    });
  }else{
    // do first and last name db search
    console.log('this is not an email');

    user.findByName(req.query.searchTerm, function(error, results){
      if (error){
        console.log(error);
        return (error);
      }else{
        return res.render('pages/search',{
          results: results,
          searchTerm: req.query.searchTerm
        });
      }
    });
  }
}