// Hamburger functionality 
$(document).ready(function() {
    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.nav').toggleClass('active');
        $('.menu-toggle').toggleClass('bg');
    });

    // User dropdown toggle, only for desktop
    $('.user-list').on('click', function() {
            $('.drop-down').toggleClass('open');
            $('.fa-chevron-up').toggleClass('down');
    });
});


