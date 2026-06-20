(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMobileMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        start();
    }

    function normalized(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var region = scope.querySelector('[data-region-filter]');
            var type = scope.querySelector('[data-type-filter]');
            var year = scope.querySelector('[data-year-filter]');
            var sort = scope.querySelector('[data-sort-select]');
            var results = scope.querySelector('[data-filter-results]');
            var count = scope.querySelector('[data-result-count]');
            if (!results) {
                return;
            }
            var cards = Array.prototype.slice.call(results.querySelectorAll('[data-movie-card]'));

            function matches(card) {
                var query = normalized(input && input.value);
                var cardText = normalized(card.getAttribute('data-search'));
                var cardRegion = card.getAttribute('data-region') || '';
                var cardType = card.getAttribute('data-type') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var regionValue = region ? region.value : '';
                var typeValue = type ? type.value : '';
                var yearValue = year ? year.value : '';

                return (!query || cardText.indexOf(query) !== -1) &&
                    (!regionValue || cardRegion === regionValue) &&
                    (!typeValue || cardType === typeValue) &&
                    (!yearValue || cardYear === yearValue || cardYear === yearValue.replace(/\D/g, ''));
            }

            function sortCards(visibleCards) {
                var value = sort ? sort.value : '';
                if (!value) {
                    return visibleCards;
                }
                return visibleCards.slice().sort(function (a, b) {
                    if (value === 'title-asc') {
                        var titleA = normalized(a.querySelector('.link-title, h3') && a.querySelector('.link-title, h3').textContent);
                        var titleB = normalized(b.querySelector('.link-title, h3') && b.querySelector('.link-title, h3').textContent);
                        return titleA.localeCompare(titleB, 'zh-Hans-CN');
                    }
                    if (value === 'heat-desc') {
                        return Number(b.getAttribute('data-heat') || 0) - Number(a.getAttribute('data-heat') || 0);
                    }
                    return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                });
            }

            function apply() {
                var visible = [];
                cards.forEach(function (card) {
                    var ok = matches(card);
                    card.classList.toggle('is-hidden', !ok);
                    if (ok) {
                        visible.push(card);
                    }
                });
                sortCards(visible).forEach(function (card) {
                    results.appendChild(card);
                });
                if (count) {
                    count.textContent = visible.length + ' 部';
                }
            }

            [input, region, type, year, sort].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q && input) {
                input.value = q;
            }
            apply();
        });
    }

    function setupImageFallbacks() {
        var images = Array.prototype.slice.call(document.querySelectorAll('.poster-frame img, .hero-poster img, .category-thumbs img'));
        images.forEach(function (image) {
            image.addEventListener('error', function () {
                var frame = image.closest('.poster-frame');
                if (frame) {
                    frame.classList.add('image-missing');
                }
                image.setAttribute('aria-hidden', 'true');
            });
        });
    }

    ready(function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupFilters();
        setupImageFallbacks();
    });
})();
