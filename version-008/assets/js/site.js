document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dots button"));
        var current = 0;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        var input = scope.querySelector("[data-filter-text]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
        var selectedYear = "all";
        var selectedType = "all";

        if (input && input.id === "site-search") {
            var params = new URLSearchParams(window.location.search);
            var keyword = params.get("q");
            if (keyword) {
                input.value = keyword;
            }
        }

        function activate(buttons, activeButton) {
            buttons.forEach(function (button) {
                button.classList.toggle("is-active", button === activeButton);
            });
        }

        function update() {
            var keyword = input ? input.value.trim().toLowerCase() : "";
            cards.forEach(function (card) {
                var text = card.getAttribute("data-search") || "";
                var year = card.getAttribute("data-year") || "";
                var type = card.getAttribute("data-type") || "";
                var matchesText = !keyword || text.indexOf(keyword) !== -1;
                var matchesYear = selectedYear === "all" || year === selectedYear;
                var matchesType = selectedType === "all" || type === selectedType;
                card.classList.toggle("is-hidden-card", !(matchesText && matchesYear && matchesType));
            });
        }

        var yearButtons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-year]"));
        yearButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedYear = button.getAttribute("data-filter-year") || "all";
                activate(yearButtons, button);
                update();
            });
        });

        var typeButtons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-type]"));
        typeButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedType = button.getAttribute("data-filter-type") || "all";
                activate(typeButtons, button);
                update();
            });
        });

        if (input) {
            input.addEventListener("input", update);
        }

        update();
    });
});
