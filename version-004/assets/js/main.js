(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-hero-dot')) || 0;
      showSlide(index);
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      startHero();
    });
  });

  startHero();

  var searchInput = document.querySelector('[data-search-input]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var empty = document.querySelector('[data-empty-message]');

  function applyFilter() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var typeValue = typeFilter ? typeFilter.value : '';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();
      var cardType = card.getAttribute('data-type') || '';
      var matchedText = !query || haystack.indexOf(query) !== -1;
      var matchedType = !typeValue || cardType === typeValue;
      var visible = matchedText && matchedType;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.hidden = visibleCount !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('q');
    if (keyword) {
      searchInput.value = keyword;
      applyFilter();
    }
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilter);
  }
})();
