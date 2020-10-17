$('#experienceModal').on('show.bs.modal', function(e) {
    console.log('hi');
    var experienceID = $(e.relatedTarget).data(exp-id);
    $(e.currentTarget).find('input[name="experienceID"]').val(experienceID);
});

$(document).ready(function() {
    $('#alert').fadeOut(5000); // 5 seconds x 1000 milisec = 5000 milisec
});