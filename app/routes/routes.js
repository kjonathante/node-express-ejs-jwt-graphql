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

router.post('/login', userController.login)

router.get('/edit-profile', userController.editProfilePage);

router.post('/edit-profile', userController.editProfile);

// router.get('/', function(req, res) {
//   res.render('index')
// });

// router.get('/signup', function(req, res) {
//   res.render('signup')
// });

router.get('/profile', function(req, res) {
  res.render('profile')
});



router.get('/search', function(req, res) {
  res.render('search')
});


router.get('/github/repos/:username', githubController.getRepos)

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