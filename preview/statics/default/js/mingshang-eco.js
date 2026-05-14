(function () {
  var doc = document;
  var win = window;
  var reduceMotion = win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = doc.querySelector("[data-header]");
  var toggle = doc.querySelector("[data-nav-toggle]");
  var nav = doc.querySelector("[data-nav]");
  var progress = doc.querySelector("[data-progress]");
  var heroImage = doc.querySelector(".eco-hero__visual img");
  var ticking = false;

  function setHeaderState() {
    if (header) {
      header.classList.toggle("is-scrolled", win.scrollY > 8);
    }
  }

  function setProgress() {
    if (!progress) return;
    var max = doc.documentElement.scrollHeight - win.innerHeight;
    var ratio = max > 0 ? win.scrollY / max : 0;
    progress.style.transform = "scaleX(" + Math.max(0, Math.min(1, ratio)) + ")";
  }

  function setHeroParallax() {
    if (!heroImage || reduceMotion) return;
    var offset = Math.min(90, win.scrollY * 0.08);
    heroImage.style.transform = "translateY(" + offset + "px) scale(1.06)";
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () {
      setHeaderState();
      setProgress();
      setHeroParallax();
      ticking = false;
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function prepareReveal() {
    var selectors = [
      ".eco-proof article",
      ".eco-section__head",
      ".eco-product-card",
      ".eco-lab__media",
      ".eco-lab__copy",
      ".eco-application-item",
      ".eco-case-card",
      ".eco-process__head",
      ".eco-process__steps div",
      ".eco-news__grid > div",
      ".eco-news-list article",
      ".eco-cta__inner",
      ".eco-footer__grid > div"
    ];
    var nodes = Array.prototype.slice.call(doc.querySelectorAll(selectors.join(",")));
    nodes.forEach(function (node, index) {
      node.classList.add("eco-reveal");
      node.style.setProperty("--reveal-delay", Math.min((index % 6) * 70, 350) + "ms");
    });

    if (!("IntersectionObserver" in win) || reduceMotion) {
      nodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12
    });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function animateStat(stat) {
    var text = stat.textContent.trim();
    var match = text.match(/^(\d+)(.*)$/);
    if (!match) return;
    var target = parseInt(match[1], 10);
    var suffix = match[2] || "";
    var start = 0;
    var duration = 1100;
    var startTime = null;
    stat.classList.add("is-counting");

    function frame(time) {
      if (!startTime) startTime = time;
      var progressValue = Math.min((time - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progressValue, 3);
      stat.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (progressValue < 1) {
        win.requestAnimationFrame(frame);
      } else {
        stat.textContent = text;
        stat.classList.remove("is-counting");
      }
    }

    win.requestAnimationFrame(frame);
  }

  function prepareStats() {
    var stats = Array.prototype.slice.call(doc.querySelectorAll(".eco-stats dt"));
    if (!stats.length || reduceMotion) return;

    if (!("IntersectionObserver" in win)) {
      stats.forEach(animateStat);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.6
    });

    stats.forEach(function (stat) {
      observer.observe(stat);
    });
  }

  function prepareTilt() {
    if (reduceMotion) return;
    var cards = Array.prototype.slice.call(doc.querySelectorAll(".eco-product-card, .eco-case-card"));
    cards.forEach(function (card) {
      card.classList.add("eco-tilt");
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var rotateY = ((x / rect.width) - 0.5) * 8;
        var rotateX = ((0.5 - (y / rect.height)) * 8);
        card.style.setProperty("--mx", (x / rect.width) * 100 + "%");
        card.style.setProperty("--my", (y / rect.height) * 100 + "%");
        card.style.transform = "translateY(-6px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  function boot() {
    setHeaderState();
    setProgress();
    setHeroParallax();
    prepareReveal();
    prepareStats();
    prepareTilt();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  win.addEventListener("scroll", onScroll, { passive: true });
  win.addEventListener("resize", onScroll);
})();
