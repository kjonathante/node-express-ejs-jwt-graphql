var mysql = require('mysql')
var config = require('../conf/config.js')

var state = {
  pool: null,
}

exports.connect = function() {
  state.pool = mysql.createPool({
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
  })
}

exports.pool = function() {
  return state.pool
}
