var timer = new Timer();
timer.start({countdown: true, startValues: {seconds: 30}});
$('#timer .values').html(timer.getTimeValues().toString());
timer.addEventListener('secondsUpdated', function (e) {
  $('#timer .values').html(timer.getTimeValues().toString());
});
timer.addEventListener('targetAchieved', function (e) {
  $('#timer .values').html('KABOOM!!');
});
