var bcrypt = require('bcryptjs');
const db = require('../db/db.js')

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

exports.findByName = function( search, callback ) {
  if(search.indexOf(' ') < 0){

    db.pool().query({  
      sql: 'SELECT id, first_name, last_name FROM users WHERE (first_name = ?) OR (last_name = ?) OR (gitlink = ?) GROUP BY id',
      values: [search,search,search],
    }, function( error, results, fields) {
      if (error) {
        return callback(error)
      }
  
      if (results.length == 0){
        return callback(new Error('No such user') )
      }else {
        // console.log('one word search: '+ results);
        console.log('\none word search: '+ results[0].id, results[0].first_name);
        return callback(null, results);
      }
    });

  }else{
    var firstName = search.split(' ')[0];
    var lastName = search.split(' ')[1];
    db.pool().query({  
      sql: 'SELECT id, first_name, last_name FROM users WHERE (first_name = ? AND last_name = ?) OR (first_name = ?) OR (last_name = ?) OR (gitlink = ?) OR (gitlink = ?) OR (first_name = ?) OR (last_name = ?) GROUP BY id',
      values: [firstName,lastName,firstName,lastName,firstName,lastName,lastName,firstName],
    }, function( error, results, fields) {
      if (error) {
        return callback(error)
      }
  
      if (results.length == 0){
        return callback(new Error('No such user') )
      }else {
        return callback(null, results);
      }
    });
  }  
}

exports.writeMessages = function(text,id, sender, callback){
  console.log(text, id);
  db.pool().query({
    sql: 'INSERT INTO messages (user_message, user_id, sender) VALUES (?)',
    values: [[text,id, sender]],
  },function(error, results, fields){
    if (error) {
      return callback(error)
    }else{
      return callback(null, results);
    }  
  });
}

exports.readMessages = function(id,callback){
  db.pool().query({
    sql: 'SELECT user_message, sender, DATE_FORMAT(timeEntered,"%a %b %d %Y %T") AS timeEntered FROM messages WHERE user_id=? ORDER BY timeEntered DESC',
    values: [id],
  }, function(error,results,fields){
    if (error) {
      return callback(error)
    }else{
      return callback(null, results);
    } 
  });
}