// Allows user to select picture
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#user-pic').attr('src', e.target.result);
            $('#placeholder-pic').hide();
            $('#user-pic').show();
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#pic-upload").change(function(){
    readURL(this);
});

//Used to retain user selected picture
var userPic = $('#user-pic').attr('src');
if (userPic == '/images/'){
    $('#user-pic').hide();
}else{
    $('#placeholder-pic').hide();
    $('#user-pic').show();
}

// Pulls users githubs repos and displays them for selection
$('#repo-btn').on('click', function(){
    event.preventDefault();
    $('#github-selection').empty();
    var username = $('#validationCustom04').val().trim();
    $.ajax({
      url: '/github/repos/'+username
    }).then(function(data, textStatus, errorThrown){
        var res = data.data;
        $('#repo-btn').attr('class', 'btn btn-success');
        // $('#repo-btn').text('Success!');
        $('#pull-success').show();
        $('#github-selection').show();
        for (var i in res){
            var repoNames = res[i].name;
            var urls = res[i].url;
            var div = $('<div>');
            div.attr('class', 'form-check');
            var input = $('<input>');
            input.attr('class', 'form-check-input');
            input.attr('type', 'checkbox');
            input.attr('name', 'git_repo');
            // input.attr('value', urls);
            input.attr('value', res[i].id);
            var label = $('<label>');
            label.attr('class', 'form-check-label');
            label.text(repoNames);

            // --- kit's ---
            var hiddenElement = $('<input>')
            hiddenElement.attr('type','hidden')
            hiddenElement.attr('name', 'github_repo_json')
            hiddenElement.attr('value', JSON.stringify(res[i]))
            // --- kit's end ---
            div.append(input,label,hiddenElement)

            console.log(res[i]);
            $('#github-selection').append(div);
        }
      },
      function(jqXHR, textStatus, errorThrown){
        console.log(textStatus, errorThrown)
        if (errorThrown === 'Bad Request'){
            $('#pull-success').hide();
            $('#github-selection').hide();
            $('#validationCustom04').val('');
            $('#repo-btn').attr('class', 'btn btn-danger');
            // $('#repo-btn').text('Error..');
            $('#validationCustom04').attr('placeholder', 'That username does not exist');
        }else if(errorThrown === 'Not Found'){
            $('#pull-success').hide();
            $('#github-selection').hide();
            $('#validationCustom04').val('');
            // $('#repo-btn').text('Error..');
            $('#repo-btn').attr('class', 'btn btn-danger');
            $('#validationCustom04').attr('placeholder', 'Please enter your username');
        }
      }
    );
})

// Shrinks the container for display purposes
$('#edit-profile-container').submit(function(){
    $('#edit-profile-container').fadeOut('slow');
    $('#profile-generator').fadeIn('slow');
    $('#update-gif').show();
    // $('#edit-profile-container').attr('style','font-size: 1vw;');
    // $('#github-selection').attr('style','display: block; line-height: 26px;');
});