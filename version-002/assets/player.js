(function () {
  function setupMoviePlayer(videoUrl) {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('player-overlay');
    var playButton = document.getElementById('poster-play-button');
    var hls = null;
    var loaded = false;

    if (!video || !videoUrl) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function loadVideo() {
      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
        } else {
          video.src = videoUrl;
        }
        loaded = true;
      }

      hideOverlay();
      video.setAttribute('controls', 'controls');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', loadVideo);
    }

    if (playButton) {
      playButton.addEventListener('click', function (event) {
        event.stopPropagation();
        loadVideo();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        loadVideo();
      }
    });

    video.addEventListener('play', hideOverlay);

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
