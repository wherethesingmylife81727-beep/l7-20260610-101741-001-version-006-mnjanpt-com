document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchStatus = document.querySelector('[data-search-status]');

  if (searchForm && searchResults && typeof MOVIES_SEARCH_DATA !== 'undefined') {
    var params = new URLSearchParams(window.location.search);
    var keywordInput = searchForm.querySelector('[name="q"]');
    var typeSelect = searchForm.querySelector('[name="type"]');
    var regionSelect = searchForm.querySelector('[name="region"]');
    var yearSelect = searchForm.querySelector('[name="year"]');

    if (keywordInput && params.get('q')) {
      keywordInput.value = params.get('q');
    }

    function card(movie) {
      return [
        '<article class="movie-card">',
        '  <a class="movie-cover" href="./' + movie.filename + '" aria-label="' + escapeHtml(movie.title) + ' 在线观看">',
        '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="cover-shade"></span>',
        '    <span class="movie-pill">' + escapeHtml(movie.type) + '</span>',
        '    <span class="movie-year">' + escapeHtml(movie.year) + '</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h3><a href="./' + movie.filename + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <p class="movie-card-meta">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.genre) + '</p>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function runSearch() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var typeValue = typeSelect ? typeSelect.value : '';
      var regionValue = regionSelect ? regionSelect.value : '';
      var yearValue = yearSelect ? yearSelect.value : '';

      var results = MOVIES_SEARCH_DATA.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.oneLine
        ].join(' ').toLowerCase();

        var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
        var typeOk = !typeValue || movie.type.indexOf(typeValue) !== -1;
        var regionOk = !regionValue || movie.region.indexOf(regionValue) !== -1;
        var yearOk = !yearValue || String(movie.year) === yearValue;

        return keywordOk && typeOk && regionOk && yearOk;
      }).slice(0, 240);

      searchResults.innerHTML = results.map(card).join('');

      if (searchStatus) {
        searchStatus.textContent = results.length ? '已筛选出 ' + results.length + ' 部作品' : '没有找到匹配作品';
      }
    }

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch();
    });

    [keywordInput, typeSelect, regionSelect, yearSelect].forEach(function (field) {
      if (field) {
        field.addEventListener('input', runSearch);
        field.addEventListener('change', runSearch);
      }
    });

    runSearch();
  }
});
