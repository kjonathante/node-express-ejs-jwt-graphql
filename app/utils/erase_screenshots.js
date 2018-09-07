var fs = require('fs')
var path = require('path')
var glob = require('glob')

exports.deleteScreenshotByUserId = function( id, callback ) {
  var pathname = path.join(__dirname, '../public/images/')+id+'-ss_*.png'
  glob( pathname, function(error, files) {
    if (error) {
      return callback(error)
    }
    for(var i=0, len=files.length; i < len; i++) {
      fs.unlinkSync(files[i])
    }
    return callback(null)
  })
}
