$(document).ready(function(){

$(".socials-item a").click(function(){
  var hrefs = $(this).attr('href');
  $('.container-right').addClass("hidden");
  $(hrefs).removeClass("hidden");
});

$("#close, .logo-standby").click(function(){
  $('.container-right').addClass("hidden");
  $('#intro').removeClass("hidden");
});



});