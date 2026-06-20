(function () {
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            if (window.Hls) {
                resolve();
                return;
            }
            var script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function setStatus(player, message) {
        var status = player.querySelector('[data-player-status]');
        if (status) {
            status.textContent = message;
        }
    }

    function playNative(video, src, player) {
        video.src = src;
        video.addEventListener('loadedmetadata', function () {
            video.play().catch(function () {
                setStatus(player, '浏览器阻止了自动播放，请再次点击视频播放。');
            });
        }, { once: true });
        player.classList.add('is-playing');
        video.load();
    }

    function playWithHls(video, src, player) {
        var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            player.classList.add('is-playing');
            video.play().catch(function () {
                setStatus(player, '播放已初始化，请再次点击视频播放。');
            });
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
                setStatus(player, '播放源加载失败，请检查 m3u8 地址或网络环境。');
                hls.destroy();
            }
        });
    }

    function startPlayer(player) {
        var video = player.querySelector('video[data-src]');
        if (!video) {
            return;
        }
        var src = video.getAttribute('data-src');
        if (!src) {
            setStatus(player, '当前详情页未找到播放源。');
            return;
        }
        setStatus(player, '正在初始化播放源…');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            playNative(video, src, player);
            return;
        }
        loadScript('https://cdn.jsdelivr.net/npm/hls.js@latest')
            .then(function () {
                if (window.Hls && window.Hls.isSupported()) {
                    playWithHls(video, src, player);
                } else {
                    setStatus(player, '当前浏览器不支持 HLS 播放。');
                }
            })
            .catch(function () {
                setStatus(player, 'HLS 播放组件加载失败，请检查网络连接。');
            });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (player) {
            var button = player.querySelector('[data-player-start]');
            if (button) {
                button.addEventListener('click', function () {
                    startPlayer(player);
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPlayers);
    } else {
        setupPlayers();
    }
})();
