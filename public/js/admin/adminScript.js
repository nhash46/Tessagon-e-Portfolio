// saves updated education field
$(document).ready(function(){
    $('.report-comment').on('click', function(e){
        $target = $(e.target);
        const harassing_user = $target.attr('harassing-user');
        const comment_id = $target.attr('comment-id');
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