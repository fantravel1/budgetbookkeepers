/* ============================================
   BudgetBookkeepers.com — Interactive JavaScript
   Vanilla JS | No Dependencies | Performance First
   ============================================ */

(function() {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initMobileMenu();
    initLangSwitcher();
    initScrollAnimations();
    initStageCards();
    initFAQ();
    initCounters();
    initScrollToTop();
    initSmoothScroll();
    initSearchBar();
    initCookieBanner();
    initParallaxShapes();
  }

  // --- Navbar Scroll ---
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const threshold = 50;

    function onScroll() {
      const currentScroll = window.pageYOffset;
      if (currentScroll > threshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    onScroll();
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Language Switcher ---
  function initLangSwitcher() {
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    if (!langBtn || !langDropdown) return;

    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.lang-switcher')) {
        langDropdown.classList.remove('active');
      }
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  function initScrollAnimations() {
    var targets = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function(el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(function(el) { observer.observe(el); });
  }

  // --- Stage Cards ---
  function initStageCards() {
    var stageCards = document.querySelectorAll('.stage-card');
    var stageResult = document.querySelector('.stage-result');
    var resultTitle = document.querySelector('.stage-result-title');
    var resultText = document.querySelector('.stage-result-text');
    if (!stageCards.length) return;

    stageCards.forEach(function(card) {
      card.addEventListener('click', function() {
        stageCards.forEach(function(c) { c.classList.remove('active'); });
        card.classList.add('active');

        if (stageResult && resultTitle && resultText) {
          var title = card.getAttribute('data-result-title');
          var text = card.getAttribute('data-result-text');
          if (title && text) {
            resultTitle.textContent = title;
            resultText.textContent = text;
            stageResult.classList.add('active');
          }
        }
      });
    });
  }

  // --- FAQ Accordion ---
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function(item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function() {
        var isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(function(fi) {
          fi.classList.remove('active');
          var ans = fi.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = '0';
        });

        // Open if was closed
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  // --- Animated Counters ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function(el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10);
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutQuart(progress);
      var current = Math.floor(eased * numericTarget);

      // Format with commas
      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + numericTarget.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // --- Scroll to Top ---
  function initScrollToTop() {
    var btn = document.querySelector('.scroll-top');
    if (!btn) return;

    function onScroll() {
      if (window.pageYOffset > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', throttle(onScroll, 100), { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // --- Search Bar ---
  function initSearchBar() {
    var searchForm = document.querySelector('.search-box form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var location = searchForm.querySelector('[name="location"]');
      var tier = searchForm.querySelector('[name="tier"]');

      // Simulate search with visual feedback
      var btn = searchForm.querySelector('.search-btn');
      if (btn) {
        var originalText = btn.textContent;
        btn.textContent = btn.getAttribute('data-searching') || 'Searching...';
        btn.disabled = true;

        setTimeout(function() {
          btn.textContent = originalText;
          btn.disabled = false;

          // Scroll to results or show message
          var stageSection = document.getElementById('stages');
          if (stageSection) {
            stageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 1500);
      }
    });
  }

  // --- Cookie Banner ---
  function initCookieBanner() {
    var banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    if (localStorage.getItem('bb-cookies-accepted')) return;

    setTimeout(function() {
      banner.classList.add('visible');
    }, 2000);

    var acceptBtn = banner.querySelector('.cookie-accept');
    var declineBtn = banner.querySelector('.cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('bb-cookies-accepted', 'true');
        banner.classList.remove('visible');
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function() {
        localStorage.setItem('bb-cookies-accepted', 'declined');
        banner.classList.remove('visible');
      });
    }
  }

  // --- Parallax Shapes ---
  function initParallaxShapes() {
    var shapes = document.querySelectorAll('.hero-bg-shapes .shape');
    if (!shapes.length) return;

    window.addEventListener('scroll', throttle(function() {
      var scrollY = window.pageYOffset;
      shapes.forEach(function(shape, i) {
        var speed = (i + 1) * 0.03;
        shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
      });
    }, 16), { passive: true });
  }

  // --- Utility: Throttle ---
  function throttle(fn, wait) {
    var lastTime = 0;
    return function() {
      var now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

})();
