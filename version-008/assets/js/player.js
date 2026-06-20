(function () {
    window.initVideoPlayer = function (videoId, coverId, mediaUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var started = false;
        var hlsInstance = null;

        if (!video || !cover || !mediaUrl) {
            return;
        }

        function attach() {
            if (started) {
                return;
            }

            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = mediaUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(mediaUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = mediaUrl;
            }
        }

        function play() {
            attach();
            cover.classList.add("is-hidden");
            video.controls = true;
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {
                    cover.classList.remove("is-hidden");
                });
            }
        }

        cover.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (!started) {
                play();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    };
})();
