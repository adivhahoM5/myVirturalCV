(function () {
  "use strict";

  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const copyBtn = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");
  const progressBar = document.getElementById("scrollProgressBar");
  const backToTop = document.getElementById("backToTop");
  const splash = document.getElementById("spaceSplash");
  const starCanvas = document.getElementById("starCanvas");
  const email = "adivhahoM5@outlook.com";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Space splash + stars ---------- */
  function initStars() {
    if (!starCanvas) return;
    const ctx = starCanvas.getContext("2d");
    let w, h, stars, raf;

    function resize() {
      w = starCanvas.width = window.innerWidth;
      h = starCanvas.height = window.innerHeight;
      stars = Array.from({ length: Math.min(160, Math.floor((w * h) / 8000)) }, function () {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          a: Math.random(),
          s: Math.random() * 0.02 + 0.005,
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        st.a += st.s;
        const alpha = 0.35 + Math.abs(Math.sin(st.a)) * 0.65;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 246, 252, " + alpha + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return function stop() {
      cancelAnimationFrame(raf);
    };
  }

  function runSplash() {
    document.body.classList.add("splash-active");
    const stopStars = reducedMotion ? function () {} : initStars();

    const delay = reducedMotion ? 400 : 2000;

    setTimeout(function () {
      if (splash) {
        splash.classList.add("is-exit");
      }
      document.body.classList.add("is-ready");
      document.body.classList.remove("splash-active");

      setTimeout(function () {
        if (splash && splash.parentNode) {
          splash.parentNode.removeChild(splash);
        }
        stopStars();
      }, 950);
    }, delay);
  }

  /* ---------- Scroll UI ---------- */
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? Math.min(1, y / docHeight) : 0;

    if (header) {
      if (y > 20) header.classList.add("header-scrolled");
      else header.classList.remove("header-scrolled");
    }

    if (progressBar) {
      progressBar.style.width = (progress * 100).toFixed(2) + "%";
    }

    if (backToTop) {
      if (y > 400) backToTop.classList.add("btt-visible");
      else backToTop.classList.remove("btt-visible");
    }
  }

  /* ---------- Mobile menu (fixed hamburger) ---------- */
  function setMenuOpen(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      mobileMenu.hidden = false;
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu.hidden = true;
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  function toggleMenu() {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  /* ---------- Reveals ---------- */
  function setupReveals() {
    const targets = document.querySelectorAll(
      "section > h2, section > .grid, section > .space-y-5, section > .space-y-4, article, .bg-gh-surface"
    );
    targets.forEach(function (el, i) {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal");
        if (i < 5) el.classList.add("d" + Math.min(i, 4));
      }
    });

    if (reducedMotion) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.05 }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Copy email ---------- */
  function setupCopy() {
    if (!copyBtn) return;
    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  function showCopied() {
    copyBtn.classList.add("copy-copied");
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
    if (copyStatus) copyStatus.textContent = "Email address copied.";
    setTimeout(function () {
      copyBtn.classList.remove("copy-copied");
      copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
      if (copyStatus) copyStatus.textContent = "";
    }, 2000);
  }

  function fallbackCopy() {
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showCopied();
    } catch (e) {
      if (copyStatus) copyStatus.textContent = "Select and copy manually.";
    }
    document.body.removeChild(ta);
  }

  /* ---------- Init --------- */
  function init() {
    runSplash();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });
    }

    if (mobileMenu) {
      mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

    // Close menu on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) closeMenu();
    });

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      });
    }

    setupReveals();
    setupCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();