var user = require('../models/user.model.js')

exports.getAll = async function(req, res, next) {
  var results
  try {
    results = await user.getAll()
  } catch (error) {
    res.send('Ops')
    throw error
  }
  res.send(results)
} 
