(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function createResultItem(movie) {
    var item = document.createElement("a");
    item.className = "search-result-item";
    item.href = movie.url;

    var img = document.createElement("img");
    img.src = movie.cover;
    img.alt = movie.title;

    var text = document.createElement("div");
    var title = document.createElement("strong");
    title.textContent = movie.title;
    var meta = document.createElement("span");
    meta.textContent = movie.year + " · " + movie.category;

    text.appendChild(title);
    text.appendChild(meta);
    item.appendChild(img);
    item.appendChild(text);
    return item;
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initSearch() {
    var movies = window.SEARCH_MOVIES || [];
    $all("[data-search-box]").forEach(function (box) {
      var input = $("[data-search-input]", box);
      var results = $("[data-search-results]", box);
      if (!input || !results) {
        return;
      }

      input.addEventListener("input", function () {
        var keyword = normalize(input.value);
        results.innerHTML = "";
        if (!keyword) {
          results.classList.remove("is-open");
          return;
        }

        var matched = movies.filter(function (movie) {
          return normalize(movie.title + " " + movie.category + " " + movie.year + " " + movie.genre).indexOf(keyword) !== -1;
        }).slice(0, 8);

        if (!matched.length) {
          var empty = document.createElement("div");
          empty.className = "search-result-item";
          empty.textContent = "暂无匹配内容";
          results.appendChild(empty);
        } else {
          matched.forEach(function (movie) {
            results.appendChild(createResultItem(movie));
          });
        }
        results.classList.add("is-open");
      });

      document.addEventListener("click", function (event) {
        if (!box.contains(event.target)) {
          results.classList.remove("is-open");
        }
      });
    });
  }

  function initMenu() {
    var button = $("[data-menu-toggle]");
    var panel = $("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = $("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = $all("[data-hero-slide]", hero);
    var dots = $all("[data-hero-dot]", hero);
    var index = 0;

    function show(next) {
      index = next;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show((index + 1) % slides.length);
      }, 5200);
    }
  }

  function initPageFilters() {
    var list = $("[data-card-list]");
    var textInput = $("[data-page-filter]");
    var yearSelect = $("[data-year-filter]");
    var typeSelect = $("[data-type-filter]");
    var empty = $("[data-empty-state]");

    if (!list || !textInput) {
      return;
    }

    var cards = $all("[data-card]", list);
    var years = [];
    var types = [];

    cards.forEach(function (card) {
      var year = card.getAttribute("data-year") || "";
      var type = card.getAttribute("data-type") || "";
      if (year && years.indexOf(year) === -1) {
        years.push(year);
      }
      if (type && types.indexOf(type) === -1) {
        types.push(type);
      }
    });

    years.sort(function (a, b) {
      return Number(b) - Number(a);
    });
    types.sort();

    if (yearSelect) {
      years.forEach(function (year) {
        var option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }

    if (typeSelect) {
      types.forEach(function (type) {
        var option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
      });
    }

    function applyFilter() {
      var keyword = normalize(textInput.value);
      var year = yearSelect ? yearSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year")
        ].join(" "));
        var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchedYear = !year || card.getAttribute("data-year") === year;
        var matchedType = !type || card.getAttribute("data-type") === type;
        var matched = matchedKeyword && matchedYear && matchedType;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-open", visible === 0);
      }
    }

    textInput.addEventListener("input", applyFilter);
    if (yearSelect) {
      yearSelect.addEventListener("change", applyFilter);
    }
    if (typeSelect) {
      typeSelect.addEventListener("change", applyFilter);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSearch();
    initMenu();
    initHero();
    initPageFilters();
  });
})();
