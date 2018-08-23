var express = require('express')
var mysql = require('mysql')

var config = require('./app/db/db.conf')

var app = express()

var conn = mysql.createConnection({
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  host: config.dbHost,
  port: config.dbPort,
})

app.get('/', function(req, res) {
  res.send('Hello')
})

app.get('/db', function(req, res) {
  conn.query({
    sql: 'SELECT * FROM items'
  }, function(error, results, fields){
    if (error) throw error

    var str = ''
    for(var val of results) {
      str += val.item + '</br>'
    }
    res.send(str)
  })
})

app.listen(3000)