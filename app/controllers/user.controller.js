//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------
// native
var path = require('path')
var fs = require('fs')
// npm
// including bcrypt for password encryption
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
// local
// exporting user.model.js which runs all the DB functions.
var user = require('../models/user.model.js')
var gitrepo = require('../models/gitrepo.model.js')
var db = require('../db/db.js')
var puppet = require('../utils/puppet.js')

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
  gitrepo.findRandomRepo(function(error, results){
    if(error){
      if(typeof req.session.user == 'undefined'){
        return res.render('pages/index');
      }else{
        return res.render('pages/index',{userInfo: req.session.user.userInfo});
      }
    }
    var randomNum = Math.floor(Math.random()*results.length);
    console.log(results.length);
    if (results.length != 0){
      if(typeof req.session.user == 'undefined'){
        console.log('came in here');
        return res.render('pages/index',{url: results[randomNum].githubpage});
      }else{
        return res.render('pages/index',{url: results[randomNum].githubpage,
                                          userInfo: req.session.user.userInfo});
      }
    }else{
      gitrepo.getRepoCount(function(error, results){
        console.log(results[0].id);
        if(typeof req.session.user == 'undefined'){
          return res.render('pages/index',{repoCount: results[0].id});
        }else{
          return res.render('pages/index',{userInfo: req.session.user.userInfo,
                                            repoCount: results[0].id});
        }
      })
      
    }
    
  });
}

// load the signup 
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
                  subject: 'CodeBook Registration Confirmation',
                  text: 'Hi, '+results[0].first_name+'\n\nThat was easy! Your account is created.\n\nSincerely,\nCodeBook Team'
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

exports.loginPage = function( req, res, next ) {
  return res.render('pages/login')
}

exports.login = function( req, res, next ) {
//Oops! It appears you forgot one of the fields.. or maybe you forgot to <a href="signup" class="alert-link">sign up</a>.
//Oops! It appears you have entered the wrong email or password.. or maybe you forgot to <a href="signup" class="alert-link">sign up</a>.

  if (req.body.email_address && req.body.password) {
    user.authenticate(req.body.email_address, req.body.password, function (error, user) {
      if (error || !user) {
        return res.render('pages/login', 
          {
            error: 'Oops! It appears you have entered the wrong email or password.. ',
            alertInfo: 'alert-warning'
          }
        )
      } else {
        req.session.user = { 
          userInfo : {  
            id: user.id,
            email_address: req.body.email_address,
            first_name: user.first_name,
            last_name: user.last_name,
          }
        }
        var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/profile/'+user.id;
        delete req.session.redirectTo
        return res.redirect(redirectTo)
      }
    })
  } else {
    return res.render('pages/login', 
      {
        error: 'Oops! It appears you forgot one of the fields.. ',
        alertInfo: 'alert-danger'
      }
    )
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
    // return res.redirect('/');
    return res.redirect('/login');
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

  var id = req.session.user.userInfo.id

  var fileName = ""
  if (req.files.photourl) {
    var ext = req.files.photourl.mimetype.split('/')[1]
    //console.log('Inside editProfile -->> ext', ext)

    var photoFile = req.files.photourl
    fileName = req.session.user.userInfo.id+"_"+req.session.user.userInfo.first_name+"_"+req.session.user.userInfo.last_name+"."+ext;
    photoFile.mv(path.join(__dirname,'../public/images/')+fileName, function(err) {
      if (err) {
        return next(err)
      }
    });
  } else {
    fileName = req.body.photourl2
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

    var selectedRepos
    if (!req.body.git_repo) {
      // undefine, null or ''
      selectedRepos = []
    } else if (typeof req.body.git_repo == 'string') {
      selectedRepos = [req.body.git_repo]
    } else {
      selectedRepos = req.body.git_repo
    }


    var userRepos
    if (!req.body.github_repo_json) {
      // undefine, null or ''
      userRepos = []
    } else if (typeof req.body.github_repo_json == 'string') {
      userRepos = [req.body.github_repo_json]
    } else {
      userRepos = req.body.github_repo_json
    }
    
    var userData = userRepos.map( function( val ) {
      var obj = JSON.parse( val )
      var selected = false
      var githubpage = `https://${req.body.gitlink}.github.io/${obj.name}`
      var screenshot = `${id}-ss_${obj.name}.png`

      for( var repoId of selectedRepos ) {
        console.log('Inside editProfile -->> obj.id, repoId :', obj.id, repoId)
        if (obj.id == repoId) {
          selected = true
        }
      }
      //'INSERT INTO gitrepos(repo_id, name, url, selected, githubpage, screenshot, ghpagestatus, user_id)      
      return [ obj.id, obj.name, obj.url, selected, githubpage, screenshot, 404, id ]
    })

    console.log('Inside editProfile -->> userRepors', userRepos)
    console.log('Inside editProfile -->> selectedRepos', selectedRepos)
    console.log('Inside editProfile -->> userData', userData)

    // no github repo
    if (userData.length < 1) {
      return res.redirect('/profile/' + id )
    }


    require('../utils/erase_screenshots').deleteScreenshotByUserId(id, function(error) {
      if (error) {
        return next(error)
      }

      puppet.screenshot2( userData, function(error, userData){
        if (error) {
          return next(error)
        }

        gitrepo.deleteAllByUserId( id, function(error, results) {
          if (error) {
            return next(err)
          }
    
          gitrepo.insertBulk(userData, function(error, result) {
            if (error) {
              return next(error)
            }
    
            return res.redirect('/profile/' + id )
          })
        })
      })
    })
  })
}

exports.profile = function(req, res, next) {

  var userInfo
  if (req.session.user) {
    console.log( 'Inside profile --> req.session.user: ', req.session.user)
    userInfo = { 
      id: req.session.user.userInfo.id,
      first_name: req.session.user.userInfo.first_name
    }
  }
  user.findById( req.params.id, function(error,results) {
    if (error) {
      return res.render('pages/profile', {error: error, userInfo: userInfo})
      // return next(error)
    } else {
      //Get git repos to display
      gitrepo.findByUserId( req.params.id, function(error,userGitRepos){
        if (error) {
          return next(error)
        } else {

          //Read messages for message board
          user.readMessages(req.params.id, function(error, messages){
            console.log(messages);
            
            results.git_repos = userGitRepos
            console.log('Inside user.controller.profile -> results: ', results)
            return res.render('pages/profile', {userInfo: userInfo, results: results, messages: messages} );
          })

          // results.git_repos = userGitRepos
    
          // console.log('Inside user.controller.profile -> results: ', results)
          // return res.render('pages/profile', {userInfo: userInfo, results: results} );    
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
        // console.log(results.id, results.first_name, results.last_name, req.query.searchTerm);
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
        // console.log('this is logging: ',error);
        return res.render('pages/search',{error,searchTerm: req.query.searchTerm});
      }else{
        // console.log(error, results);
        return res.render('pages/search',{
          results: results,
          searchTerm: req.query.searchTerm
        });
      }
    });
  }
}

exports.writeMessage = function(req, res){
  console.log(req.body);
  var sender = 'Anonymous';
  if(typeof req.session.user == 'undefined'){
    sender = 'Anonymous'
  }else{
    sender = req.session.user.userInfo.first_name;
  }
  user.writeMessages(req.body.user_message,req.body.id, sender, function(error, results){
    if (error){
      throw(error);
    }
    console.log("message written", req.session.user);
    return res.redirect('/profile/'+req.body.id);
  });
}

exports.getParticles = function(req, res){
  res.render('pages/particle');
}