const express = require('express')
const app = express();
const router = express.Router()
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json());

var userController = require('../controllers/user.controller.js')
var githubController = require('../controllers/github.controller.js')

router.get('/', function(req, res) {
  res.render('index')
});

router.get('/signup', function(req, res) {
  res.render('signup')
});

router.get('/profile', function(req, res) {
  res.render('profile')
});

router.get('/edit-profile', function(req, res) {
  res.render('edit-profile')
});

router.get('/search', function(req, res) {
  res.render('search')
});

router.get('/db', userController.getAll)

router.get('/github/repos/:username', githubController.getRepos)

router.post('/signin', urlencodedParser, function(req, res){
  console.log(req.body);
  res.redirect('/profile');
});

router.post('/signup', urlencodedParser, function(req, res){
  var name = req.body.first+' '+req.body.last;
  console.log(req.body);
});

router.post('/edit-profile', urlencodedParser, function(req, res){
  var name = req.body.first+' '+req.body.last;
  console.log(req.body);
});

module.exports = router;