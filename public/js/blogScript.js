// allows user to edit comment
$(document).ready(function(){
    $(".edit-comment-form").hide();
    $('.edit-comment').on('click', function(e){
        e.stopPropagation();
        $(this).siblings().toggle('slow');
    });
});

// allow user to delete comment
$(document).ready(function(){
    $('.delete-comment').on('click', function(e){
        $target = $(e.target);
        const blog_id = $target.attr('blog-id');
        const comment_id =$target.attr('comment-id');
        const username = $target.attr('user-username');
        $.ajax({
            type: 'DELETE',
            url: '/comments/'+comment_id,
            success: function(response){
                alert('Deleting Comment');
                window.location.href='/blog-posts/'+username+'/'+blog_id;
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
        const username = $target.attr('user-username');
        $.ajax({
            url: '/blog-posts/'+username+'/'+_id,
            type: 'DELETE',
            success: function(response){
                alert('Deleting Blog');
                window.location.href='/blog-posts/'+username;
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

// like comment
$(document).ready(function(){
    $('.like-comment').on('click', function(e){
        $target = $(e.target);
        const comment_id = $target.attr('comment-id');
        const blog_id = $target.attr('blog-id');
        const username = $target.attr('user-username');
        $.ajax({
            url: '/comments/likedComment/'+comment_id,
            type: 'POST',
            success: function(response){
                alert('1');
                location.reload();
                window.location.href='/blog-posts/'+username+'/'+blog_id;
            },
            error: function(err){
                console.log(err.message);
            }
        });
    });
});