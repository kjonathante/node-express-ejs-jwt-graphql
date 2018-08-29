var fs = require('fs')
var path = require('path')
var https = require('https')
require('dotenv').config()

function loadQuery( filename ) {
  return new Promise( function( resolve, reject ) {
    fs.readFile( path.join(__dirname, filename), 'utf-8', function(err, data) {
      return (err) ? reject(err) : resolve(data)
    })
  })
}

function buildBody( query ) {
  return {
    body: JSON.stringify({ query: query })
  }
}

function buildBodyWithVariables( query, variables ) {
  return { 
    body: JSON.stringify({ query: query, variables: variables })
  }
}

function buildHeaders(auth, body) {
  return {

    body: body.body,
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.body.length,
        'User-Agent': '' + auth.user,
        'Authorization': 'token ' + auth.token
    }
  }
}

function buildRequestOptions(request) {
  return {
    body: request.body,
    options: {
      method: 'POST',
      host: 'api.github.com',
      path: '/graphql',
      port: 443,
      headers: request.headers
    }
  }
}

function makeRequest(request) {
  var options = request.options
  var body = request.body

  return new Promise(function (resolve, reject) {
    https.request(options, function (res) {
      var result = ''

      res.on('data', function (chunk) {
        return result += chunk
      })

      res.on('end', function () {
        return resolve(JSON.parse(result))
      })

      res.on('error', function (err) {
        return reject(err);
      })

    }).write(body)
  })
}

var x = async function (filename, variables) {
  try {
    var query = await loadQuery( filename )

    var body = buildBodyWithVariables(query, variables)

    var headers = buildHeaders({
      user: process.env.PERSON, 
      token: process.env.TOKEN
    }, body)

    var request = buildRequestOptions( headers )
    var data = await makeRequest(request)

    return data
    // console.log( 'query ->\n', query)
    // console.log( 'body ->\n', body)
    // console.log( 'headers ->\n', headers)
    // console.log( 'request ->\n', request)
    // console.dir(data, {depth: null})

  } catch( error ) {
    // console.log(error)
    throw error
  }
}

exports.getRepos = x

// x('./query.gql', {username: 'kjonathante'})
// .then( function(data) {
//   console.dir(data, {depth: null})
// })