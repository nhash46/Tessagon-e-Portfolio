// saves updated education field
$(document).ready(function(){
    $('.edit-education').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('education-id');
        var uni = $("#university"+_id).val();
        var degree = $("#degree"+_id).val();
        var eduStart = $("#eduStart"+_id).val();
        var eduEnd = $("#eduEnd"+_id).val();
        var desc = $("#eduDescription"+_id).val();
        var dataString = 'university='+uni+'&degree='+degree+'&educationStartDate='+eduStart+'&educationEndDate='+eduEnd+'&description='+desc;
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
    $('.delete-education').on('click', function(e){
        $target = $(e.target);
        const education_id = $target.attr('education-id');
        $.ajax({
            url: '/user/education/'+education_id,
            type: 'DELETE',
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
    $('.add-education').on('click', function(e){
        $target = $(e.target);
        const education_id = $target.attr('education-id');
        $.ajax({
            url: '/user/addEducation/'+education_id,
            type: 'POST',
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