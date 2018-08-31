var bcrypt = require('bcryptjs');
const db = require('../db/db.js')

// exports.getAll = function() {
//   return new Promise ( function(resolve, reject){
//     db.pool().query({
//       sql: 'SELECT * FROM users',
//     },
//     function (error, results, fields) {
//       // error will be an Error if one occurred during the query
//       // results will contain the results of the query
//       // fields will contain information about the returned results fields (if any)
//       if (error) {
//         return reject(error)
//       }
//       return resolve(results)
//     })
//   })
// }

exports.authenticate = function( email_address, password, callback ) {
  db.pool().query({  
    sql: 'SELECT id, password_hash, first_name, last_name FROM users WHERE email_address = ?',
    values: [email_address],
  }, function( error, results, fields) {
    console.log('inside authenticate ', error)
    console.log('inside authenticate ', results)
    if (error) {
      return callback(error)
    }

    if (results.length == 0){
      return callback(new Error('No such user') )
    }else {
      bcrypt.compare(password, results[0].password_hash, function(error, result) {
        if (result == true){
          return callback(null, { 
            id: results[0].id,
            first_name: results[0].first_name,
            last_name: results[0].last_name,
          })
        }else{
          return callback(error)
        }
      })
    }
  })
}

exports.findByEmail = function( email_address, callback ) {
  db.pool().query({  
    sql: 'SELECT id, first_name, last_name FROM users WHERE email_address = ?',
    values: [email_address],
  }, function( error, results, fields) {
    if (error) {
      return callback(error)
    }

    if (results.length == 0){
      return callback(new Error('No such user') )
    }else {
      return callback(null, { 
        id: results[0].id,
        first_name: results[0].first_name,
        last_name: results[0].last_name,
      })
    }
  })
}

exports.findById = function( id, callback ) {
  db.pool().query({  
    sql: 'SELECT id, first_name, last_name, email_address, gitlink, linkedin, photourl FROM users WHERE id = ?',
    values: [id],
  }, function( error, results, fields) {
    if (error) {
      return callback(error)
    }

    if (results.length == 0){
      return callback(new Error('No such user') )
    }else {
      return callback(null, results[0])
    }
  })
}

exports.update = function(id, data, callback) {
  db.pool().query(
    {
      sql: 'UPDATE users SET first_name=?, last_name=?, gitlink=?, linkedin=?, photourl=? WHERE id=?',
      values: [data.first_name, data.last_name, data.gitlink, data.linkedin, data.photourl, id]
    }, 
    function (error, results, fields) {
      if (error) {
        return callback(error)
      }

      return callback()
    }
  )
}