// saves updated experience field
$(document).ready(function(){
    $('.edit-achievement').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('achievement-id');
        var achievement_name = $("#achievement_name"+_id).val();
        var descriptionAch= $("#descriptionAch"+_id).val();

        var dataString = 'achievement_name'=+achievement_name+'&descriptionAch='+descriptionAch;
        $.ajax({
            url: '/user/editAchievement/'+_id,
            type: 'POST',
            data: dataString,
            success: function(response){
                location.reload();
                window.location.href='/user/profile#portfolio';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
  });




$(document).ready(function(){
    $('.delete-achievement').on('click', function(e){
        $target = $(e.target);
        const achievement_id = $target.attr('achievement-id');
        $.ajax({
            url: '/user/achievement/'+achievement_id,
            type: 'DELETE',
            success: function(response){
                location.reload();
                window.location.href='/user/profile#portfolio';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.add-experience').on('click', function(e){
        location.reload();
        window.location.href='/user/profile#experience';
    })
});