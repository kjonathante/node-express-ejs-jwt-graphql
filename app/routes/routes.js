const express = require('express')
const router = express.Router()

var dbController = require('../controllers/db.controller.js')

router.get('/', function(req, res) {
  res.send('Hello')
})

router.get('/db', dbController.getAll)

module.exports = router;