// var timer = new easyTimer.Timer();
var timer;

function setTimer(seconds=30){
  timer = new easytimer.Timer();
  timer.start({countdown: true, startValues: {seconds: seconds}});
  $('#timer .values').html(timer.getTimeValues().toString());
  timer.addEventListener('secondsUpdated', function (e) {
    $('#timer .values').html(timer.getTimeValues().toString());
  });
  timer.addEventListener('targetAchieved', function (e) {
    $('#timer .values').html('KABOOM!!');
  });
}
