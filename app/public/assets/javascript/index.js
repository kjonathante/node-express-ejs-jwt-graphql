// Hides load gif after page load
$('#browser').ready(function(){
    $("#load-gif").fadeOut("slow");
});

var pages = ['https://tayloraanenson.github.io/Bootstrap-Portfolio-V2/', 'https://tayloraanenson.github.io/TriviaGame/', 'https://tayloraanenson.github.io/cryptoform/', 'https://tayloraanenson.github.io/unit-4-game/', 'https://tayloraanenson.github.io/star-wars-rpg/', 'https://tayloraanenson.github.io/psychic-game/'];

var ranPage = pages[Math.floor(Math.random()*pages.length)];

console.log(ranPage);

$('object').attr('data',ranPage);