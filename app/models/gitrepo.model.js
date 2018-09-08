const db = require('../db/db.js')

exports.insertBulk = function( data, callback ) {
  db.pool().query({
    sql: 'INSERT INTO gitrepos(repo_id, name, url, selected, githubpage, screenshot, ghpagestatus, user_id) VALUES ?',
    values: [data],
  },function(error,results,fields){
    if (error) {
      return callback(error)
    } else {
      return callback(null, results.insertId)
    }
  })
}

exports.deleteAllByUserId = function( id, callback ) {
  db.pool().query({
    sql: 'DELETE FROM gitrepos WHERE user_id=?',
    values: [id]
  }, function(error,results,fields){
    if (error) {
      return callback(error)
    } else {
      return callback(null, results.affectedRows)
    }
  })
}

exports.findByUserId = function( id, callback ) {
  db.pool().query({
    sql: 'SELECT name, screenshot, githubpage FROM gitrepos WHERE user_id=?',
    values: [id],
  },function(error,results,fields){
    if (error) {
      return callback(error)
    } else {
      return callback(null, results)
    }
  })
}

exports.findRandomRepo = function(callback){
  db.pool().query('SELECT * from gitrepos WHERE selected = 1 AND ghpagestatus = 200', function(err, results,fields){
    if (err) {
      return callback(err)
    } else {
      return callback(null, results)
    }
  });
}

exports.getRepoCount = function(callback){
  db.pool().query('SELECT COUNT(id) id FROM gitrepos', function(err, results, fields){
    if (err) {
      return callback(err)
    } else {
      return callback(null, results)
    }
  });
}