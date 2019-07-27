$('.message .close').on('click', function(){
    $(this).closest('.message').transition('fade');
});

$('.ui.dropdown').dropdown();

$('.ui.rating').rating({maxRating: 5});

$('.ui.rating').rating('disable');