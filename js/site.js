(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.getElementById('mainNav');
    var search = document.querySelector('.search-form');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      if (search) {
        search.classList.toggle('open');
      }
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;

    function show(index) {
      current = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    show(0);
    window.setInterval(function () {
      show(current + 1);
    }, 5000);
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video[data-video-src]');
      var button = player.querySelector('[data-play-button]');
      if (!video || !button) {
        return;
      }
      var source = video.getAttribute('data-video-src');
      var started = false;

      function start() {
        if (!source) {
          return;
        }
        if (!started) {
          started = true;
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
          } else {
            video.src = source;
          }
        }
        player.classList.add('playing');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            player.classList.remove('playing');
          });
        }
      }

      button.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (!started || video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
          player.classList.remove('playing');
        }
      });
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '' +
      '<article class="movie-card">' +
      '<a class="movie-cover" href="' + escapeHtml(movie.link) + '">' +
      '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '</a>' +
      '<div class="movie-body">' +
      '<h3><a href="' + escapeHtml(movie.link) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine || '') + '</p>' +
      '<div class="movie-meta"><span>' + escapeHtml(movie.region || '') + '</span><span>' + escapeHtml(movie.year || '') + '</span></div>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function setupSearchPage() {
    var list = document.querySelector('[data-search-list]');
    if (!list || !window.SITE_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim().toLowerCase();
    var input = document.querySelector('.large-search input[name="q"]');
    if (input) {
      input.value = params.get('q') || '';
    }
    var results = window.SITE_MOVIES;
    if (query) {
      results = results.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.region,
          movie.year,
          movie.type,
          movie.oneLine,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        return haystack.indexOf(query) !== -1;
      });
    } else {
      results = results.slice(0, 36);
    }
    list.innerHTML = results.slice(0, 120).map(movieCard).join('');
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupPlayers();
    setupSearchPage();
  });
})();
