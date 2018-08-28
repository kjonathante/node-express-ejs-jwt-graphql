$("#test_form").submit( function() {
  event.preventDefault()
  
  var username = $('#github_username').val()

  $.ajax({
    url: '/github/repos/'+username
  }).then(
    function(data, textStatus, jqXHR){
      console.log(data)
    }, 
    function(jqXHR, textStatus, errorThrown){
      console.log(textStatus, errorThrown)
    }
  )
})
