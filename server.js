var express = require('express')

var db = require('./app/db/db.js')
var routes = require('./app/routes/routes.js')

var app = express()

db.connect()

app.use('/', routes)



// app.get('/db', function(req, res) {
  
//   db.pool().query({
//     sql: 'SELECT * FROM users'
//   }, function(error, results, fields){
//     if (error) throw error

//     var str = ''
//     for(var val of results) {
//       str += val.id + '</br>'
//     }
//     res.send(str)
//   })
// })

app.listen(3000)