(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  ready(function () {
    var header = document.querySelector('[data-site-header]');
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var hero = document.querySelector('[data-hero-slider]');
    var pageSearch = document.querySelector('[data-page-search]');
    var filterSelects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var emptyMessage = document.querySelector('[data-empty-message]');

    function updateHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 16) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (menuToggle && header) {
      menuToggle.addEventListener('click', function () {
        header.classList.toggle('is-open');
      });
    }

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;

      function showSlide(index) {
        current = index;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          showSlide(dotIndex);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide((current + 1) % slides.length);
        }, 5200);
      }
    }

    function applyFilters() {
      if (!cards.length) {
        return;
      }
      var query = normalize(pageSearch ? pageSearch.value : '');
      var active = {};
      filterSelects.forEach(function (select) {
        active[select.getAttribute('data-filter-select')] = normalize(select.value);
      });
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var matched = !query || text.indexOf(query) !== -1;

        Object.keys(active).forEach(function (key) {
          var value = active[key];
          if (value && normalize(card.getAttribute('data-' + key)) !== value) {
            matched = false;
          }
        });

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (emptyMessage) {
        emptyMessage.classList.toggle('is-visible', visible === 0);
      }
    }

    if (pageSearch || filterSelects.length) {
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q');
      if (pageSearch && initialQuery) {
        pageSearch.value = initialQuery;
      }
      if (pageSearch) {
        pageSearch.addEventListener('input', applyFilters);
      }
      filterSelects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
      });
      applyFilters();
    }
  });
})();
