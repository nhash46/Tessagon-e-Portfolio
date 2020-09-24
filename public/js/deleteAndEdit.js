// saves updated education field
$(document).ready(function(){
    $('.edit-education').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('education-id');
        $.ajax({
            type: 'POST',
            url: '/user/editEducation/'+_id,
            success: function(response){
                window.location.href='/user/profile#education';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});


// allows user to edit comment
$(document).ready(function(){
    $(".edit-comment-form").hide();
    $('.edit-comment').on('click', function(e){
        e.stopPropagation();
        $(this).siblings().toggle('slow');
    });
});

$(document).ready(function(){
    $('.delete-comment').on('click', function(e){
        $target = $(e.target);
        const blog_id = $target.attr('blog-id');
        const comment_id =$target.attr('comment-id');
        $.ajax({
            type: 'DELETE',
            url: '/comments/'+comment_id,
            success: function(response){
                alert('Deleting Comment');
                window.location.href='/blog-posts/'+blog_id;
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

// deletes post
$(document).ready(function(){
    $('.delete-blog').on('click', function(e){
        $target = $(e.target);
        const _id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/blog-posts/'+_id,
            success: function(response){
                //alert('Deleting Forum');
                window.location.href='/blog-posts';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});