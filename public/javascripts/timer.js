var now = Math.floor(new Date().getTime() / 1000);
var user_times = new Object();

function initTimer() {
    $( ".active_timer.time" ).each( function(index) {
            var username = $(this).attr('id');

            // condition 1: if user_time is defined, simply keep it
            if( user_times[username] )
                return

            // else do this
            var user_time = $(this).html();
            var elapsed = now - parseInt(user_time);

            user_times[username] = elapsed;
            //alert( prettyTime(elapsed));
            $(this).text( prettyTime(elapsed));
            });
}

function updateTimer() {
    $( ".active_timer.time" ).each( function(index) { 
            var username = $(this).attr('id');

            var prev_time = user_times[username];
            var new_time = +prev_time + 1;

            user_times[username] = new_time;
            //alert(new_time);
            $(this).text(prettyTime(new_time));
            });   
}

function prettyTime( totalSec ) {
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    return (hours < 10 ? "0" + hours : hours) + " hr " + (minutes < 10 ? "0" + minutes : minutes) + " min " + (seconds  < 10 ? "0" + seconds : seconds) + " sec ";
}



$( document ).ready ( function () {
    initTimer();
    setInterval(updateTimer, 1000);
});

