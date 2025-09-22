// Hamburger functionality 
$(document).ready(function() {
    $('.menu-toggle').on('click', function() {
        $('.nav').toggleClass('active');
        $('.menu-toggle').toggleClass('bg');

    });
});