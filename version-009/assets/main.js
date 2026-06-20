(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupCards() {
    var panels = Array.prototype.slice.call(document.querySelectorAll(".search-panel"));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var input = panel.querySelector(".site-search");
      var sort = panel.querySelector(".sort-select");
      var empty = panel.querySelector(".empty-state");
      var grid = scope.querySelector("[data-card-grid]");
      if (!cards.length || !grid) {
        return;
      }
      var original = cards.slice();

      function apply() {
        var query = normalize(input ? input.value : "");
        var visible = [];
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search") + " " + card.getAttribute("data-title"));
          var match = !query || text.indexOf(query) !== -1;
          card.hidden = !match;
          if (match) {
            visible.push(card);
          }
        });
        if (empty) {
          empty.hidden = visible.length !== 0;
        }
      }

      function applySort() {
        var value = sort ? sort.value : "default";
        var ordered = original.slice();
        if (value === "year-desc") {
          ordered.sort(function (a, b) {
            return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
          });
        }
        if (value === "heat-desc") {
          ordered.sort(function (a, b) {
            return Number(b.getAttribute("data-heat")) - Number(a.getAttribute("data-heat"));
          });
        }
        if (value === "title-asc") {
          ordered.sort(function (a, b) {
            return String(a.getAttribute("data-title")).localeCompare(String(b.getAttribute("data-title")), "zh-Hans-CN");
          });
        }
        ordered.forEach(function (card) {
          grid.appendChild(card);
        });
        cards = ordered;
        apply();
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      if (sort) {
        sort.addEventListener("change", applySort);
      }
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupCards();
  });
})();
