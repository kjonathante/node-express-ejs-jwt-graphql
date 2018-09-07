//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------

const express = require('express')
// const app = express();
const router = express.Router()
// const bodyParser = require('body-parser');
//var urlencodedParser = 


var userController = require('../controllers/user.controller.js')
var githubController = require('../controllers/github.controller.js')
// var urlencodedParser = bodyParser.urlencoded({extended: true});
// app.use(bodyParser.json());


//----------------------------------------------------------VARIABLES----------------------------------------------


//----------------------------------------------------------FUNCTIONS----------------------------------------------


router.get('/', userController.homePage);

router.get('/signup', userController.signUpPage);

router.post('/signup',userController.signUp);

router.get('/login',  userController.loginPage)
router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/edit-profile', userController.authorize, userController.editProfilePage);

router.post('/edit-profile', userController.authorize, userController.editProfile);

router.get('/search', userController.search);

router.get('/profile/:id', userController.profile);

router.get('/github/repos/:username', githubController.getRepos);

router.post('/message', userController.writeMessage);

router.get('/particle/:count', userController.getParticles);

// router.get('/search', function(req, res) {
//   res.render('search')
// });



// router.post('/signin', urlencodedParser, function(req, res){
//   console.log(req.body);
//   res.redirect('/profile');
// });

// router.post('/signup', urlencodedParser, function(req, res){
//   var name = req.body.first+' '+req.body.last;
//   console.log(req.body);
// });

// router.post('/edit-profile', urlencodedParser, function(req, res){
//   var name = req.body.first+' '+req.body.last;
//   console.log(req.body);
// });

module.exports = router;