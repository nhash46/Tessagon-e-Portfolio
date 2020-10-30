// saves updated education field
$(document).ready(function(){
    $('.report-comment').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('education-id');
        var uni = $("#university"+_id).val();
        var degree = $("#degree"+_id).val();
        var eduStart = $("#eduStart"+_id).val();
        var eduEnd = $("#eduEnd"+_id).val();
        var desc = $("#descriptionEdu"+_id).val();
        var dataString = 'university='+uni+'&degree='+degree+'&educationStartDate='+eduStart+'&educationEndDate='+eduEnd+'&descriptionEdu='+desc;
        $.ajax({
            url: '/user/editEducation/'+_id,
            type: 'POST',
            data: dataString,
            success: function(response){
                location.reload();
                window.location.href='/user/profile#education';
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