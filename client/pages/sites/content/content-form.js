$(document).ready(function(){
    $('p.field-description').each(function(x) {
        console.log('ssssss');
       $(this).after('<i class="fa fa-question-circle-o fa-fw" title="" data-content="' + $(this).html() + '" data-toggle="popover"></i>');
       $(this).hide();
    });
    $('[data-toggle="popover"]').popover();
});
