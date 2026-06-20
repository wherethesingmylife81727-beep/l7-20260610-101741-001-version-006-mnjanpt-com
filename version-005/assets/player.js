function initMoviePlayer(streamUrl) {
  var video = document.querySelector('[data-player-video]');
  var cover = document.querySelector('[data-player-poster]');
  var button = document.querySelector('[data-play-button]');
  var hlsInstance = null;
  var loaded = false;

  if (!video) {
    return;
  }

  function loadStream() {
    if (loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function startPlayback() {
    loadStream();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;
    var playback = video.play();

    if (playback && typeof playback.catch === 'function') {
      playback.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  if (button) {
    button.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (!loaded) {
      startPlayback();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
