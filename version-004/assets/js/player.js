(function () {
  var player = document.getElementById('moviePlayer');
  var cover = document.querySelector('[data-player-cover]');
  var hlsInstance = null;

  if (!player) {
    return;
  }

  var source = player.getAttribute('data-m3u8');

  function hideCover() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  function attachSource() {
    if (!source) {
      return false;
    }

    if (player.canPlayType('application/vnd.apple.mpegurl')) {
      if (player.src !== source) {
        player.src = source;
      }
      return true;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(player);
      }
      return true;
    }

    if (player.src !== source) {
      player.src = source;
    }
    return true;
  }

  function startPlayback() {
    hideCover();
    attachSource();
    var playRequest = player.play();
    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  player.addEventListener('click', function () {
    if (!player.src && !hlsInstance) {
      startPlayback();
    }
  });

  player.addEventListener('play', function () {
    hideCover();
    attachSource();
  });
})();
