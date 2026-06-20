(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-hidden');
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var previous = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function resetHero() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    startHero();
  }

  if (slides.length) {
    showSlide(0);
    startHero();
  }

  if (previous) {
    previous.addEventListener('click', function () {
      showSlide(current - 1);
      resetHero();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      resetHero();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      resetHero();
    });
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var input = panel.querySelector('[data-search-input]');
    var category = panel.querySelector('[data-filter-category]');
    var year = panel.querySelector('[data-filter-year]');
    var region = panel.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var empty = document.querySelector('[data-empty-state]');

    function valueOf(control) {
      return control ? control.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var query = valueOf(input);
      var selectedCategory = valueOf(category);
      var selectedYear = valueOf(year);
      var selectedRegion = valueOf(region);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.textContent
        ].join(' ').toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesCategory = !selectedCategory || (card.getAttribute('data-category') || '').toLowerCase() === selectedCategory;
        var matchesYear = !selectedYear || (card.getAttribute('data-year') || '').toLowerCase() === selectedYear;
        var matchesRegion = !selectedRegion || (card.getAttribute('data-region') || '').toLowerCase() === selectedRegion;
        var matches = matchesQuery && matchesCategory && matchesYear && matchesRegion;

        card.style.display = matches ? '' : 'none';

        if (matches) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [input, category, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('[data-player-overlay]');
    var playButton = player.querySelector('[data-play-button]');
    var loaded = false;
    var hlsInstance = null;

    if (!video) {
      return;
    }

    function playVideo() {
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function loadVideo() {
      var src = video.getAttribute('data-src');

      if (!src) {
        return;
      }

      if (loaded) {
        playVideo();
        hideOverlay();
        return;
      }

      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          backBufferLength: 30
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
      } else {
        video.src = src;
        playVideo();
      }

      hideOverlay();
    }

    if (playButton) {
      playButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        loadVideo();
      });
    }

    player.addEventListener('click', function (event) {
      if (event.target === video && loaded) {
        return;
      }
      loadVideo();
    });

    video.addEventListener('play', hideOverlay);
    video.addEventListener('ended', function () {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
}());
