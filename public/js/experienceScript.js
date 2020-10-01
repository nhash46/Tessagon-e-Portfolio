// saves updated experience field
$(document).ready(function(){
    $('.edit-experience').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('experience-id');
        var company = $("#company").prev.val();
        var role = $("#role").prev.val();
        var expStart = $("#start").prev.val();
        var expEnd = $("#end").prev.val();
        var dataString = 'company='+company+'&role='+role+'&experienceStartDate='+expStart+'&experienceEndDate='+expEnd;
        $.ajax({
            url: '/user/editExperience/'+_id,
            type: 'POST',
            data: dataString,
            success: function(){
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