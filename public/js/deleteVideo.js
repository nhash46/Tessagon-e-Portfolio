$(document).ready(function(){
    $('.delete-video').on('click', function(e){
        $target = $(e.target);
        const video_id = $target.attr('video-id');
        $.ajax({
            url: '/user/video/'+video_id,
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