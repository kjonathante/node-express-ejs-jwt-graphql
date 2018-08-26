const express = require('express')
const router = express.Router()

// const QuestionController = require('../controllers/question.controller')
// const AnswerController = require('../controllers/answer.controller')
// const authController = require('../controllers/auth.controller')

// router.get( '/questions', authController.auth, QuestionController.getAll ) //R

// router.post( '/answers', AnswerController.create ) //C

router.get('/', function(req, res) {
  res.send('Hello')
})

module.exports = router;