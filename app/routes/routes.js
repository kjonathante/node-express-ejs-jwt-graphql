const express = require('express')
const router = express.Router()

var userController = require('../controllers/user.controller.js')
var githubController = require('../controllers/github.controller.js')

router.get('/', function(req, res) {
  // res.send('Hello')
  res.render('index')
})

router.get('/db', userController.getAll)

router.get('/github/repos/:username', githubController.getRepos)

module.exports = router;