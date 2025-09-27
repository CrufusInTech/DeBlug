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


// Swiper/Carousel

const swiper = new Swiper('.wrapper', {
  loop: true,
  spaceBetween: 30,

  // Autoplay
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

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


