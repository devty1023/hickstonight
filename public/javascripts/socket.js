var socket = io.connect('http://localhost:3000');
socket.on('checkedIn', function (data) {
    // find span with nickanme ( id )
    // delete it
    $( "#inactive" ).children( "#"+data.nickname ).remove();

    // create a new span
    var new_div = '<div class="active_timer" id="' + data.nickname +'">';
    new_div += '<div class="panel-body", id="active">'
    new_div += '<span class="glyphicon glyphicon-user"></span> ' + data.nickname;
    new_div += '<div class="active_timer time" id="' + data.nickname + '">' + data.active_since;
        new_div += '</div></div></div>';

    // insert to new 
    $( '#active' ).append( new_div );


    // we shold initialize timer
    //initTimer()

    //console.log(data);
    //alert(data.nickname);
});

socket.on('checkedOut', function (data) {
    // find span with nickanme ( id )
    // delete it
    $( "#active" ).children( "#"+data.nickname ).remove();

    // create a new span
    var new_div = '<div class="inactive_timer" id="' + data.nickname +'">';
    new_div += '<div class="panel-body", id="inactive">'
    new_div += '<span class="glyphicon glyphicon-user"></span> ' + data.nickname;
    new_div += '<div class="inactive_timer time" id="' + data.nickname + '"> offline';
        new_div += '</div></div></div>';

    // insert to new 
    $( '#inactive' ).append( new_div );

    // we have to clear user_times data for this user
    user_times[data.nickname] = null;

});
