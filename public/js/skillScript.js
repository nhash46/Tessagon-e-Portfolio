// saves updated experience field
$(document).ready(function(){
    $('.edit-skill').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('skill-id');
        var name = $("#skills"+_id).val();
        var dataString = 'skill_name='+name;
        $.ajax({
            url: '/user/editSkill/'+_id,
            type: 'POST',
            data: dataString,
            success: function(response){
                location.reload();
                window.location.href='/user/profile#skills';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
  });




$(document).ready(function(){
    $('.delete-skill').on('click', function(e){
        $target = $(e.target);
        const skill_id = $target.attr('skill-id');
        $.ajax({
            url: '/user/skill/'+experience_id,
            type: 'DELETE',
            success: function(response){
                location.reload();
                window.location.href='/user/profile#skills';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

/**
$(document).ready(function(){
    $('.add-experience').on('click', function(e){
        location.reload();
        window.location.href='/user/profile#experience';
    })
});
$(document).ready(function(){
    $('.reset').on('click', function(e){
        location.reload('/user/profile#skills');
        window.location.href='/user/profile#skills';
    })
});
 */