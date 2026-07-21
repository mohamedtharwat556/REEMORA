/* ============================================
   REEMORA - Main JavaScript
   ============================================ */

'use strict';

/* ---- Utilities ---- */
const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

const throttle = (fn, limit) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn(...args); }
  };
};

/* ---- DOM Ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initCursor();
  initScrollProgress();
  initNavbar();
  initGallery();
  initLightbox();
  initTestimonials();
  initFAQ();
  initBookingForm();
  initBackToTop();
  initInstagram();
  initSmoothScroll();
});

/* ---- Loading Screen ---- */
function initLoading() {
  const screen = document.getElementById('loadingScreen');
  if (!screen) return;

  const hide = () => {
    screen.classList.add('hidden');
    screen.addEventListener('transitionend', () => screen.remove(), { once: true });
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 600));
  }
}

/* ---- Custom Cursor (خفيف وسريع - بدون lag) ---- */
function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

  // على موبايل/تاتش - اخفي الكيرسر
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display    = 'none';
    cursorDot.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  // الكيرسر الصغير (النقطة) يتبع الماوس مباشرة بدون lag
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // النقطة: مباشرة 100%
    cursorDot.style.left = x + 'px';
    cursorDot.style.top  = y + 'px';

    // الحلقة: lag خفيف جداً عبر CSS transition فقط
    cursor.style.left = x + 'px';
    cursor.style.top  = y + 'px';
  }, { passive: true });

  // Hover على العناصر التفاعلية
  const addHover = (el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  };

  document.querySelectorAll('a, button, .gallery-item, .service-card, .faq-question, .instagram-item')
    .forEach(addHover);

  // مراقبة عناصر جديدة تُضاف لاحقاً
  const mo = new MutationObserver(() => {
    document.querySelectorAll('a, button, .gallery-item, .service-card, .faq-question, .instagram-item')
      .forEach(addHover);
  });
  mo.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity    = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity    = '1';
    cursorDot.style.opacity = '1';
  });
}

/* ---- Scroll Progress ---- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', throttle(() => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, 16));
}

/* ---- Navbar ---- */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!navbar) return;

  // Sticky on scroll
  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, 100));

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      const link   = navbar.querySelector(`.nav-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  }, 100));
}

/* ---- Smooth Scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
  });
}

/* ---- Gallery Filtering ---- */
function initGallery() {
  const filters = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.gallery-item');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter || btn.getAttribute('data-filter') || 'all';

      items.forEach(item => {
        const cat = item.dataset.category || item.getAttribute('data-category') || '';
        const show = filter === 'all' || cat === filter;
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (show) {
          item.style.opacity   = '1';
          item.style.transform = 'scale(1)';
          item.style.display   = '';
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { if (item.style.opacity === '0') item.style.display = 'none'; }, 400);
        }
      });
    });
  });
}

/* ---- Lightbox ---- */
function initLightbox() {
  const lightbox  = document.getElementById('lightbox') || document.querySelector('.lightbox');
  if (!lightbox) return;

  const imgEl     = lightbox.querySelector('.lightbox-img') || lightbox.querySelector('img');
  const closeBtn  = lightbox.querySelector('.lightbox-close');
  const prevBtn   = lightbox.querySelector('.lightbox-prev');
  const nextBtn   = lightbox.querySelector('.lightbox-next');
  const items     = document.querySelectorAll('.gallery-item');
  let current     = 0;

  const getImages = () => [...document.querySelectorAll('.gallery-item img')];

  const open = (index) => {
    const imgs = getImages();
    if (!imgs[index]) return;
    current = index;
    if (imgEl) imgEl.src = imgs[index].src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const prev = () => {
    const imgs = getImages();
    current = (current - 1 + imgs.length) % imgs.length;
    if (imgEl) { imgEl.style.opacity = '0'; setTimeout(() => { imgEl.src = imgs[current].src; imgEl.style.opacity = '1'; }, 200); }
  };

  const next = () => {
    const imgs = getImages();
    current = (current + 1) % imgs.length;
    if (imgEl) { imgEl.style.opacity = '0'; setTimeout(() => { imgEl.src = imgs[current].src; imgEl.style.opacity = '1'; }, 200); }
  };

  // Open on item click
  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn)  prevBtn.addEventListener('click', prev);
  if (nextBtn)  nextBtn.addEventListener('click', next);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });
}

// فتح الـ lightbox من الإنستقرام
window.openLightbox = function(src) {
  const lightbox = document.getElementById('lightbox') || document.querySelector('.lightbox');
  if (!lightbox) return;
  const imgEl = lightbox.querySelector('.lightbox-img') || lightbox.querySelector('img');
  if (imgEl) imgEl.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // إغلاق بالضغط
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.onclick = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
  lightbox.onclick = (e) => { if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; } };
};
function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots  = document.querySelectorAll('.dot');
  if (!cards.length) return;

  let current   = 0;
  let autoTimer = null;

  const show = (index) => {
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i)  => d.classList.toggle('active', i === index));
    current = index;
  };

  const next = () => show((current + 1) % cards.length);

  const startAuto = () => { autoTimer = setInterval(next, 5000); };
  const stopAuto  = () => clearInterval(autoTimer);

  show(0);
  startAuto();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { show(i); stopAuto(); startAuto(); });
  });

  // Pause on hover
  const slider = document.querySelector('.testimonials-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
  }

  // Touch swipe
  let touchStartX = 0;
  const sliderEl  = document.querySelector('.testimonials-slider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend',   (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? show((current + 1) % cards.length) : show((current - 1 + cards.length) % cards.length);
        stopAuto(); startAuto();
      }
    });
  }
}

/* ---- FAQ Accordion ---- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => i.classList.remove('open'));
      // Open clicked (if wasn't open)
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ---- Booking Form ---- */
function initBookingForm() {
  const form = document.querySelector('.booking-form form') || document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    // جمع البيانات من الفورم
    const name      = form.querySelector('#name')?.value.trim() || '';
    const email     = form.querySelector('#email')?.value.trim() || '';
    const phone     = form.querySelector('#phone')?.value.trim() || '';
    const eventType = form.querySelector('#event-type');
    const eventText = eventType?.options[eventType.selectedIndex]?.text || '';
    const date      = form.querySelector('#date')?.value || '';
    const guests    = form.querySelector('#guests')?.value || '';
    const message   = form.querySelector('#message')?.value.trim() || '';

    // تنسيق الرسالة
    const whatsappMsg = [
      '🌸 *طلب حجز جديد - REEMORA*',
      '',
      `👤 *الاسم:* ${name}`,
      `📧 *البريد الإلكتروني:* ${email}`,
      `📱 *رقم الجوال:* ${phone}`,
      `🎉 *نوع المناسبة:* ${eventText}`,
      `📅 *تاريخ المناسبة:* ${date}`,
      guests ? `👥 *عدد الضيوف:* ${guests}` : '',
      message ? `📝 *تفاصيل إضافية:* ${message}` : '',
    ].filter(Boolean).join('\n');

    // رقم الواتساب (مصر 20 + الرقم بدون الصفر)
    const waNumber = '201013791517';
    const waURL    = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappMsg)}`;

    // فتح الواتساب
    window.open(waURL, '_blank');

    // تأكيد بصري على الزر
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✓ جاري فتح واتساب...';
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.field-error');
    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = '#e74c3c';
      if (!err) {
        const msg = document.createElement('span');
        msg.className = 'field-error';
        msg.style.cssText = 'color:#e74c3c;font-size:0.8rem;margin-top:4px;display:block;';
        msg.textContent = 'هذا الحقل مطلوب';
        field.parentElement.appendChild(msg);
      }
    } else {
      field.style.borderColor = '';
      if (err) err.remove();
    }
  });
  return valid;
}

/* ---- Back to Top ---- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 100));

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Instagram hover effects ---- */
function initInstagram() {
  document.querySelectorAll('.instagram-item').forEach(item => {
    item.addEventListener('mouseenter', () => item.style.transform = 'scale(1.03)');
    item.addEventListener('mouseleave', () => item.style.transform = 'scale(1)');
  });
}
