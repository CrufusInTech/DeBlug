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

// Carousel
$('.post-wrapper').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  nextArrow: $('.next'),
  prevArrow: $('.prev'),

});