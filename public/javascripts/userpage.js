$(document).ready(
    function(){
        $(".btn-delete-delete").hide();
        $(".btn-delete").click(function () {
            var id = $(this).attr('id');
            $(this).hide();
            var del = "delete"+id;
            $("#"+del).show("fast");
            $(this).parent().parent().css('background-color', '#FF9191');
    //background-color: #FF9191;
        });

        $(".btn-edit-edit").hide();
        $(".bfh-timepicker").hide();
        $(".btn-edit").click(function() {
            var id = $(this).attr('id');
            $(this).hide();
            $("#endTime"+id).hide();


            var edit1 = "edit1" + id;
            var edit2 = "edit2" + id;

            $("#"+edit1).show("fast");
            $("#"+edit2).show("fast");

            $(this).parent().parent().css('background-color', '#ACD372');
            
        });

    });
