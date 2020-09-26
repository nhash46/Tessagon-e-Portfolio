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

  $(document).ready(function(){
    $('.delete-education').on('click', function(e){
        $target = $(e.target);
        const education_id = $target.attr('education-id');
        $.ajax({
            url: '/user/education/'+education_id,
            type: 'DELETE',
            success: function(response){
                alert('Deleting Education');
                location.reload();
                window.location.href='/user/profile#education';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});