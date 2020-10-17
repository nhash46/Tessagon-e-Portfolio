$(document).ready(function(){
    $("#inputUserame").keyup(function(){
        console.log('hi');
        var username = $(this).val().trim();

        if(username != ''){

            $.ajax({
                url: '/checkUser.php',
                type: 'POST',
                data: {username: username},
                success: function(response){

                    $('#uname_response').html(response);

                }
            });
        }else{
            $("#uname_response").html("");
        }

    });

});
