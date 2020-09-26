// saves updated experience field
$(document).ready(function(){
    $('.edit-experience').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('experience-id');
        $.ajax({
            type: 'POST',
            url: '/user/editExperience/'+_id,
            success: function(response){
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
                alert('Deleting Experience');
                location.reload();
                window.location.href='/user/profile#experience';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});