$(document).ready ( function(){
    var path = window.location.href.split('/');
    var length = path.length;
    path = path[length-1];
        
    console.log(path);
    $("#hiddenMessageInput").val(path);
})