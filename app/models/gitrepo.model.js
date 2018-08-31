const db = require('../db/db.js')

exports.insert = function( id, data, callback ) {
  db.pool().query({
    sql: 'INSERT INTO gitrepos(user_id, git_repo) VALUES (?,?)',
    values: [id, data],
  },function(error,results,fields){
    if (error) {
      return callback(error)
    } else {
      return callback(null, results.insertId)
    }
  })
}

exports.findByUserId = function( id, callback ) {
  db.pool().query({
    sql: 'SELECT git_repo FROM gitrepos WHERE user_id=?',
    values: [id],
  },function(error,results,fields){
    if (error) {
      return callback(error)
    } else {
      return callback(null, results)
    }
  })
}