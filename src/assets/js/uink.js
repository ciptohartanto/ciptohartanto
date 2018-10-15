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


//fun title changes when not active
$(window).focus(function() {

  document.title = $("meta[property='og:title']").attr("content");
});

$(window).blur(function() {
  document.title = 'I miss you <3';
});
});