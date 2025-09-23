// Hamburger functionality 
$(document).ready(function() {
    $('.menu-toggle').on('click', function() {
        $('.nav').toggleClass('active');
        $('.menu-toggle').toggleClass('bg');

    });
});

$(document).ready(function() {
    $('.user-list').on('click', function() {
        $('.drop-down').toggleClass('open');
        $('.fa-chevron-up').toggleClass('down');
      
    });
});