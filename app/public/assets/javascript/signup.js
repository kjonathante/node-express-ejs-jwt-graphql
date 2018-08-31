// Hides load gif after page load
$(document).ready(function(){
    $("#load-gif").fadeOut("slow");
});

// Validates sign up form
(function formValidation(){
    'use strict';
    window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            // var first = $('#validationCustom01').val();
            // var last = $('#validationCustom02').val();
            // var user = $('#validationCustomUsername').val();
            var signUpEmail = $('#validationCustom03').val();
            var pass = $('#inputPassword').val();
            var conf = $('#confirmPassword').val();
            // console.log(first,last,user,signUpEmail,pass,conf);
        if (signUpEmail.indexOf('@') === -1 || signUpEmail.indexOf('.com') === -1){
            event.preventDefault();
            event.stopPropagation();
            $('#validationCustom03').val('');
        }
        if (pass !== conf){
            event.preventDefault();
            event.stopPropagation();
            $('#inputPassword').val('');
            $('#confirmPassword').val('');
            $('#pass .invalid-feedback').text('Great Scott!');
            $('#conf .invalid-feedback').text('Your passwords don\'t match!')
        }
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
        }, false);
    });
    }, false);
})();