var express = require('express')
var mysql = require('mysql')

//var config = require('./app/conf/conf')
var db = require('./app/db/db.js')

var app = express()

db.connect()

app.get('/', function(req, res) {
  res.send('Hello')
})

app.get('/db', function(req, res) {
  
  db.pool().query({
    sql: 'SELECT * FROM users'
  }, function(error, results, fields){
    if (error) throw error

    var str = ''
    for(var val of results) {
      str += val.id + '</br>'
    }
    res.send(str)
  })
})

app.listen(3000)