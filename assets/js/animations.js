/* ============================================
   REEMORA - Animations JavaScript
   Intersection Observer + Advanced Effects
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initReveal();
  initRipple();
  initParallax();
  initCounters();
  initGradientText();
  initProgressBars();
  initDynamicObserver();
});

/* ---- AOS (Animate On Scroll) via IntersectionObserver ---- */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        // Unobserve after first animation for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ---- Generic Reveal on Scroll ---- */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index    = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---- Ripple Effect on Buttons ---- */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}

/* ---- Parallax Effect ---- */
function initParallax() {
  const heroBg = document.querySelector('.hero-background img');
  if (!heroBg) return;

  // Only on desktop - skip on mobile for performance
  if (window.matchMedia('(max-width: 768px)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const speed   = 0.35;
    heroBg.style.transform = `scale(1.08) translateY(${scrollY * speed}px)`;
  }, { passive: true });
}

/* ---- Animated Number Counters ---- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number, [data-counter]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const raw    = el.textContent.replace(/[^0-9]/g, '');
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;

    const suffix   = el.textContent.replace(/[0-9]/g, '');
    const duration = 1800;
    const start    = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ---- Gradient Text Shimmer ---- */
function initGradientText() {
  document.querySelectorAll('.shimmer-text, [data-shimmer]').forEach(el => {
    el.classList.add('shimmer-text');
  });
}

/* ---- Progress Bar Animations ---- */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill, [data-progress]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.progress || '100';
        entry.target.style.width = target + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ---- Blur Reveal ---- */
function initBlurReveal() {
  const elements = document.querySelectorAll('.blur-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ---- Stagger Animation for Card Grids ---- */
function initStaggerCards() {
  const grids = document.querySelectorAll('.services-grid, .features-grid, .gallery-grid, .contact-grid');

  grids.forEach(grid => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = [...entry.target.children];
          children.forEach((child, i) => {
            child.style.opacity   = '0';
            child.style.transform = 'translateY(24px)';
            child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
            requestAnimationFrame(() => {
              child.style.opacity   = '1';
              child.style.transform = 'translateY(0)';
            });
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(grid);
  });
}

/* ---- Floating Elements ---- */
function initFloating() {
  document.querySelectorAll('.floating, [data-float]').forEach((el, i) => {
    const delay    = (i * 0.4) % 2;
    const duration = 4 + (i % 3);
    el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
  });
}

/* ---- Text Wave Animation ---- */
function initTextWave() {
  document.querySelectorAll('[data-wave-text]').forEach(el => {
    const text = el.textContent;
    el.innerHTML = [...text].map((char, i) =>
      char === ' '
        ? ' '
        : `<span style="display:inline-block;animation:waveText 1.2s ease ${i * 0.05}s infinite">${char}</span>`
    ).join('');
  });
}

/* ---- Section Title Reveal ---- */
function initSectionTitles() {
  const titles = document.querySelectorAll('.section-title, .hero-title');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  titles.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* ---- MutationObserver for Dynamic Content ---- */
function initDynamicObserver() {
  const body = document.body;

  const mutObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;

        // Re-apply AOS to newly added elements
        node.querySelectorAll && node.querySelectorAll('[data-aos]').forEach(el => {
          if (!el.classList.contains('aos-animate')) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(e => {
                if (e.isIntersecting) {
                  e.target.classList.add('aos-animate');
                  observer.unobserve(e.target);
                }
              });
            }, { threshold: 0.1 });
            observer.observe(el);
          }
        });

        // Re-apply ripple to new buttons
        if (node.classList && node.classList.contains('btn')) {
          node.addEventListener('click', function (e) {
            const rect   = this.getBoundingClientRect();
            const size   = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
          });
        }
      });
    });
  });

  mutObserver.observe(body, { childList: true, subtree: true });
}

/* ---- Run additional inits ---- */
document.addEventListener('DOMContentLoaded', () => {
  initBlurReveal();
  initStaggerCards();
  initFloating();
  initSectionTitles();
});
