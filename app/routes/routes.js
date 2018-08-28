//--------------------------------------------------------EXPORTS & REQUIRES---------------------------------------

const express = require('express')
const router = express.Router()

var userController = require('../controllers/user.controller.js')

//----------------------------------------------------------VARIABLES----------------------------------------------


//----------------------------------------------------------FUNCTIONS----------------------------------------------


router.get('/', userController.homePage);

router.get('/sign-up-page', userController.signUpPage);

router.post('/signup', userController.signUp);

router.get('/db', userController.getAll)

module.exports = router;