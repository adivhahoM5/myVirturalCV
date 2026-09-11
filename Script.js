(function () {
  "use strict";

  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const copyBtn = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");
  const progressBar = document.getElementById("scrollProgressBar");
  const backToTop = document.getElementById("backToTop");
  const email = "adivhahoM5@outlook.com";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function toggleMenu() {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    if (open) {
      mobileMenu.hidden = true;
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
    } else {
      mobileMenu.hidden = false;
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    mobileMenu.classList.add("hidden");
    document.body.style.overflow = "";
  }

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

  function init() {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (menuToggle) menuToggle.addEventListener("click", toggleMenu);

    if (mobileMenu) {
      mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });
    }

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