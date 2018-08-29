function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#user-pic').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#pic-upload").change(function(){
    readURL(this);
});

function gitPull(){
    event.preventDefault();

    var username = $('#validationCustom04').val();

    console.log(username);
  
    $.ajax({
      url: '/github/repos/'+username
    }).then(function(data, textStatus, errorThrown){
        var res = data.data;
        $('#validationCustom04').val('');
        $('#repo-btn').attr('class', 'btn btn-success');
        $('#repo-btn').text('Success!');
        $('#validationCustom04').val('Please select the repos you would like to show off');
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
            input.attr('value', urls);
            var label = $('<label>');
            label.attr('class', 'form-check-label');
            label.text(repoNames);
            div.append(input,label)
            console.log(res[i]);
            $('#github-selection').append(div);
        }
      },
      function(jqXHR, textStatus, errorThrown){
        console.log(textStatus, errorThrown)
        if (errorThrown === 'Bad Request'){
            $('#validationCustom04').val('');
            $('#repo-btn').attr('class', 'btn btn-danger');
            $('#repo-btn').text('Error..');
            $('#validationCustom04').attr('placeholder', 'That username does not exist');
        }else if(errorThrown === 'Not Found'){
            $('#validationCustom04').val('');
            $('#repo-btn').text('Error..');
            $('#repo-btn').attr('class', 'btn btn-danger');
            $('#validationCustom04').attr('placeholder', 'Please enter your username');
        }
      }
    );
}