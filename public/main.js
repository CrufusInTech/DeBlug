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


const swiper = new Swiper('.wrapper', {
  loop: true,
  spaceBetween: 30,

  // Pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },

  }

});


