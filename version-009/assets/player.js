(function () {
  var scriptUrl = document.currentScript ? document.currentScript.src : "";
  var assetBase = scriptUrl ? new URL(".", scriptUrl).href : "../assets/";

  function parseConfig() {
    var node = document.getElementById("playback-config");
    if (!node) {
      return null;
    }
    try {
      return JSON.parse(node.textContent || "{}");
    } catch (error) {
      return null;
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function getHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    return import(assetBase + "hls.js")
      .then(function (module) {
        return module.H || module.default || window.Hls;
      })
      .catch(function () {
        return loadScript("https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js").then(function () {
          return window.Hls;
        });
      });
  }

  function startVideo(video, overlay, src) {
    if (!src) {
      return;
    }
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (video.src !== src) {
        video.src = src;
      }
      video.play().catch(function () {});
      return;
    }
    getHls().then(function (Hls) {
      if (Hls && Hls.isSupported && Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.src = src;
        video.play().catch(function () {});
      }
    }).catch(function () {
      video.src = src;
      video.play().catch(function () {});
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var config = parseConfig();
    var video = document.getElementById("mainVideo");
    var overlay = document.getElementById("playButton");
    if (!config || !video) {
      return;
    }
    if (overlay) {
      overlay.addEventListener("click", function () {
        startVideo(video, overlay, config.src);
      });
    }
    video.addEventListener("click", function () {
      if (!video.src) {
        startVideo(video, overlay, config.src);
      }
    });
  });
})();
