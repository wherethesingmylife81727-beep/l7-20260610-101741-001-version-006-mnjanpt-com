(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            var opened = mobilePanel.hasAttribute("hidden");
            if (opened) {
                mobilePanel.removeAttribute("hidden");
            } else {
                mobilePanel.setAttribute("hidden", "");
            }
            menuButton.setAttribute("aria-expanded", String(opened));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search]"));
    var empty = document.querySelector(".search-empty");

    function applyFilter(value) {
        var words = String(value || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = String(card.getAttribute("data-search") || "").toLowerCase();
            var ok = words.every(function (word) {
                return haystack.indexOf(word) !== -1;
            });
            card.style.display = ok ? "" : "none";
            if (ok) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle("active", visible === 0);
        }
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
            filterInput.value = q;
        }
        applyFilter(filterInput.value);
        filterInput.addEventListener("input", function () {
            applyFilter(filterInput.value);
        });
    }
})();

function setupMoviePlayer(id, src) {
    var root = document.getElementById(id);
    if (!root) {
        return;
    }

    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var attached = false;
    var hls = null;

    function attach() {
        if (attached || !video) {
            return;
        }

        attached = true;
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            video.src = src;
        }
    }

    function play() {
        attach();
        if (cover) {
            cover.setAttribute("hidden", "");
        }
        if (video) {
            var run = video.play();
            if (run && typeof run.catch === "function") {
                run.catch(function () {});
            }
        }
    }

    if (cover) {
        cover.addEventListener("click", play);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (!attached || video.paused) {
                play();
            }
        });
    }

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
