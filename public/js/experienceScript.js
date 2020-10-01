// saves updated experience field
$(document).ready(function(){
    $('.edit-experience').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('experience-id');
        var company = $("#company"+_id).val();
        var role = $("#role"+_id).val();
        var expStart = $("#expStart"+_id).val();
        var expEnd = $("#expEnd"+_id).val();
        var desc = $("#expDescription"+_id).val();
        var dataString = 'company='+company+'&role='+role+'&experienceStartDate='+expStart+'&experienceEndDate='+expEnd+'&description'+desc;
        $.ajax({
            url: '/user/editExperience/'+_id,
            type: 'POST',
            data: dataString,
            success: function(response){
                location.reload();
                window.location.href='/user/profile#experience';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
  });




$(document).ready(function(){
    $('.delete-experience').on('click', function(e){
        $target = $(e.target);
        const experience_id = $target.attr('experience-id');
        $.ajax({
            url: '/user/experience/'+experience_id,
            type: 'DELETE',
            success: function(response){
                location.reload();
                window.location.href='/user/profile#experience';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});