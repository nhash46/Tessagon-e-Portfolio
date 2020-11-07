// saves updated education field
$(document).ready(function(){
    $('.report-comment').on('click', function(e){
        $target = $(e.target);
        const harassing_user = $target.attr('harassing-user');
        const comment_id = $target.attr('comment-id');
        console.log(harassing_user);
        $.ajax({
            url: '/admin/report/'+comment_id+'/'+harassing_user,
            type: 'POST',
            success: function(response){
                location.reload();
                //window.location.href='/user/profile#education';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

  $(document).ready(function(){
    $('.delete-report').on('click', function(e){
        $target = $(e.target);
        const report_id = $target.attr('report-id');
        $.ajax({
            url: '/admin/report/'+report_id,
            type: 'DELETE',
            success: function(response){
                location.reload();
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.ban-user').on('click', function(e){
        $target = $(e.target);
        const user_id = $target.attr('user-id');
        $.ajax({
            url: '/admin/ban/'+user_id,
            type: 'POST',
            success: function(response){
                location.reload();
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.unban-user').on('click', function(e){
        $target = $(e.target);
        const user_id = $target.attr('user-id');
        $.ajax({
            url: '/admin/unban/'+user_id,
            type: 'POST',
            success: function(response){
                location.reload();
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.view-reports').on('click', function(e){
        $target = $(e.target);
        const user_username = $target.attr('user-username');
        $.ajax({
            url: '/admin/reports/'+user_username,
            type: 'GET',
            success: function(response){

            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$('#viewReports').on('show.bs.modal', function(e) {

    //get data-id attribute of the clicked element
    var user = $target.attr('user-username');

    //populate the textbox
    $(".modal-header #userReport").val("Reports for "+ user);
});