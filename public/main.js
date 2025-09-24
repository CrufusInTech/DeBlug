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

// Carousel
$('.post-wrapper').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  nextArrow: $('.next'),
  prevArrow: $('.prev'),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]


});