var githubGQL = require('../utils/github.js')

exports.getRepos = async function(req, res, next) {
  try {
    var data = await githubGQL.getRepos('./github_query.gql', {username: req.params.username})
    console.log(data)

    if (data.data) {
      if (data.data.user) {
        res.status(200).json( {success: true, data: data.data.user.repositories.nodes} )
      } else {
        res.status(400).json( {success: false, error: data.errors[0].message} )
      }
    } else {
      throw new Error( JSON.stringify( data ) )
    }
  } catch(error) {
    console.log( error.message )
    res.status(500).json( {success: false, error: 'Internal Server Error'} )
    //throw error
  }
} 
