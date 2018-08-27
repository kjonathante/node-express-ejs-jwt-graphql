var githubGQL = require('../utils/github.js')

exports.getRepos = async function(req, res, next) {
  console.log( req.params.username )
  var data = await githubGQL.getRepos('./github_query.gql', {username: req.params.username})
  res.send( data.data.user.repositories.nodes )
} 
