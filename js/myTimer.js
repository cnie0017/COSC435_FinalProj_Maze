// var timer = new easyTimer.Timer();
var timer;

function setTimer(seconds=30){
  timer = new easytimer.Timer();
  timer.start({countdown: true, startValues: {seconds: seconds}});
  $('#timer .values').html(timer.getTimeValues().toString().slice(3));
  timer.addEventListener('secondsUpdated', function (e) {
    $('#timer .values').html(timer.getTimeValues().toString().slice(3));
  });
  timer.addEventListener('targetAchieved', function (e) {
    $('#timer .values').html('KABOOM!!');
  });
}

function hideTimer() {
  var timer = document.getElementById("timer");
  timer.setAttribute("class", "hidden");
}
