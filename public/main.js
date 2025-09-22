// Hamburger functionality 
$(document).ready(function() {
    $('.menu-toggle').on('click', function() {
        $('.nav').toggleClass('active');
        $('.menu-toggle').toggleClass('bg');

    });
});

$(document).ready(function() {
    $('.user-drop').on('click', function() {
         $('.drop-down').toggleClass('drop-close');
      
    });
});