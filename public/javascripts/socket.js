var socket = io.connect(window.location.hostname);
socket.on('checkedIn', function (data) {
    // find span with nickanme ( id )
    // delete it
    $( "#inactive" ).children( "#"+data.nickname ).remove();

    // bug fix: remove if already exist
    $( "#active" ).children( "#"+data.nickname ).remove();

    // create a new span
    var new_div = '<a href="/user/' + data.username + '" id="' + data.nickname + '">';
    new_div += '<div class="active_timer" id="' + data.nickname +'">';
    new_div += '<div class="panel-body", id="active">';
    new_div += '<span class="glyphicon glyphicon-user"> ' + data.nickname + '</span>';
    new_div += '<div class="active_timer time" id="' + data.nickname + '">' + "0";
    new_div += '</div></div></div></a>';

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

    // BUG FIX: user might click checkout twice..
    // simply remove the existing node..
    $( "#inactive" ).children( "#"+data.nickname ).remove();


    var new_div = '<a href="/user/' + data.username + '" id="' + data.nickname + '">';
    new_div += '<div class="inactive_timer" id="' + data.nickname +'">';
    new_div += '<div class="panel-body", id="inactive">';
    new_div += '<span class="glyphicon glyphicon-user"> ' + data.nickname + '</span>';
    new_div += '<div class="inactive_timer time" id="' + data.nickname + '"> offline';
        new_div += '</div></div></div></a>';

    // insert to new 
    $( '#inactive' ).append( new_div );

    // we have to clear user_times data for this user
    user_times[data.nickname] = null;

});

socket.on('updated', function (data) {
    window.location = "/";
});
