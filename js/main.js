// ===== Mobile Navigation Toggle =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
    });
  });
}

// ===== Header Scroll Effect =====
const header = document.getElementById('header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== Active Navigation Link on Scroll (homepage only) =====
const sections = document.querySelectorAll('section[id]');

if (sections.length > 0 && !document.querySelector('.page-header')) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  });
}

// ===== Dark Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('zeph-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☾' : '☀';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

// Load saved theme
const savedTheme = localStorage.getItem('zeph-theme') || 'light';
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ===== Animated CountUp for Stat Strips =====
function parseStatValue(text) {
  text = text.trim();
  let prefix = '';
  let suffix = '';
  let target = 0;
  let hasComma = false;

  // Handle < prefix
  if (text.startsWith('<')) {
    prefix = '<';
    text = text.substring(1);
  }

  // Handle % suffix
  if (text.endsWith('%')) {
    suffix = '%';
    text = text.slice(0, -1);
  }

  // Handle M suffix
  if (text.endsWith('M')) {
    suffix = 'M';
    text = text.slice(0, -1);
  }

  // Handle commas
  if (text.includes(',')) {
    hasComma = true;
    text = text.replace(/,/g, '');
  }

  target = parseFloat(text);
  return { prefix, suffix, target, hasComma };
}

function formatNumber(num, hasComma) {
  if (hasComma) {
    return Math.round(num).toLocaleString('en-US');
  }
  if (Number.isInteger(num)) return num.toString();
  return num.toString();
}

function animateCountUp(el, duration) {
  const originalText = el.textContent;
  const { prefix, suffix, target, hasComma } = parseStatValue(originalText);
  if (isNaN(target)) return;

  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const current = easedProgress * target;

    el.textContent = prefix + formatNumber(Math.round(current), hasComma) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + formatNumber(target, hasComma) + suffix;
      el.closest('.stat-item').classList.add('counted');
    }
  }

  el.textContent = prefix + '0' + suffix;
  requestAnimationFrame(update);
}

// Observe all stat strips
function animateStatGrid(grid) {
  if (grid.dataset.animated) return;
  grid.dataset.animated = 'true';
  const items = grid.querySelectorAll('.stat-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
      const num = item.querySelector('.number');
      if (num) animateCountUp(num, 2000);
    }, i * 200);
  });
}

const statStripObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStatGrid(entry.target);
      statStripObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px 50px 0px' });

document.querySelectorAll('.stat-strip-grid').forEach(grid => {
  Array.from(grid.querySelectorAll('.stat-item')).forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  statStripObserver.observe(grid);

  // Fallback: if already in viewport, animate immediately
  const rect = grid.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    setTimeout(() => animateStatGrid(grid), 300);
  }
});

// ===== Animated Counter for Trust Stats (legacy) =====
const trustStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.trust-stat .number');
      numbers.forEach((num, i) => {
        setTimeout(() => {
          animateCountUp(num, 2000);
        }, i * 200);
      });
      trustStatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.trust-stats').forEach(grid => {
  trustStatObserver.observe(grid);
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it wasn't already open)
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== Email Capture Modal =====
const emailModal = document.getElementById('emailModal');
const modalClose = document.getElementById('modalClose');
const modalForm = document.getElementById('modalForm');

// Show modal after 30 seconds if not dismissed
if (emailModal) {
  const modalDismissed = sessionStorage.getItem('zeph-modal-dismissed');

  if (!modalDismissed) {
    setTimeout(() => {
      emailModal.classList.add('active');
    }, 30000);
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      emailModal.classList.remove('active');
      sessionStorage.setItem('zeph-modal-dismissed', 'true');
    });
  }

  emailModal.addEventListener('click', (e) => {
    if (e.target === emailModal) {
      emailModal.classList.remove('active');
      sessionStorage.setItem('zeph-modal-dismissed', 'true');
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = modalForm.querySelector('input').value;
      console.log('Email subscribed:', email);

      modalForm.innerHTML = '<p style="color:var(--primary);font-weight:500;margin:0;">Thanks! You\'re on the list.</p>';
      sessionStorage.setItem('zeph-modal-dismissed', 'true');

      setTimeout(() => {
        emailModal.classList.remove('active');
      }, 2000);
    });
  }
}

// ===== Form Validation Helper =====
function validateForm(form) {
  let isValid = true;

  // Clear previous errors
  form.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error', 'success');
  });

  // Validate required fields
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    if (!group) return;

    const value = field.value.trim();

    if (!value) {
      group.classList.add('error');
      isValid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      group.classList.add('error');
      isValid = false;
    } else {
      group.classList.add('success');
    }
  });

  return isValid;
}

// Clear error on input
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
  field.addEventListener('input', () => {
    const group = field.closest('.form-group');
    if (group) group.classList.remove('error');
  });
});

// ===== Contact Form Handling =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) return;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    console.log('Form submitted:', data);

    contactForm.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem;">
        <div style="width:64px;height:64px;background:#D6FF33;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;color:#265242;font-size:1.5rem;font-weight:700;">&#10003;</div>
        <h3 style="margin-bottom:0.5rem;">Thank You!</h3>
        <p>We've received your message and will get back to you shortly.</p>
      </div>
    `;
  });
}

// ===== Demo Request Form (Clinicians page) =====
const demoForm = document.getElementById('demoForm');

if (demoForm) {
  demoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(demoForm)) return;

    const formData = new FormData(demoForm);
    const data = Object.fromEntries(formData);
    console.log('Demo requested:', data);

    demoForm.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem;">
        <div style="width:64px;height:64px;background:#D6FF33;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;color:#265242;font-size:1.5rem;font-weight:700;">&#10003;</div>
        <h3 style="margin-bottom:0.5rem;">Demo Requested!</h3>
        <p>Our clinical partnerships team will reach out within 24 hours.</p>
      </div>
    `;
  });
}

// ===== Smooth Reveal on Scroll =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Fade up (default)
document.querySelectorAll('.section-header, .feature-card, .testimonial-card, .step-card, .science-img, .article-card, .pricing-card, .team-card, .chart-card, .trust-stat, .full-bleed-content, .cta-section h2, .cta-section p, .faq-item, .contact-info, .contact-form').forEach(el => {
  el.classList.add('reveal', 'reveal-up');
  revealObserver.observe(el);
});

// Fade in from left (split images on left side)
document.querySelectorAll('.split:not(.split-reverse) .split-image').forEach(el => {
  el.classList.add('reveal', 'reveal-left');
  revealObserver.observe(el);
});

// Fade in from right (split content on right side, and reversed split images)
document.querySelectorAll('.split:not(.split-reverse) .split-content, .split-reverse .split-image').forEach(el => {
  el.classList.add('reveal', 'reveal-right');
  revealObserver.observe(el);
});

// Fade in from left (reversed split content)
document.querySelectorAll('.split-reverse .split-content').forEach(el => {
  el.classList.add('reveal', 'reveal-left');
  revealObserver.observe(el);
});

// Scale up for full-bleed images
document.querySelectorAll('.full-bleed img').forEach(el => {
  el.classList.add('reveal', 'reveal-scale');
  revealObserver.observe(el);
});

// Staggered delays for grid children
document.querySelectorAll('.steps-grid, .testimonials-grid, .partners-grid').forEach(grid => {
  grid.children && Array.from(grid.children).forEach((child, i) => {
    child.classList.add('reveal', 'reveal-up');
    child.style.transitionDelay = `${i * 0.12}s`;
    revealObserver.observe(child);
  });
});

// Stat items: skip reveal observer (countUp handles their entrance animation)

// Staggered grid children for sub-pages
document.querySelectorAll('.features-grid, .articles-grid, .spec-grid, .team-grid, .chart-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    if (!child.classList.contains('reveal')) {
      child.classList.add('reveal', 'reveal-up');
      child.style.transitionDelay = `${i * 0.12}s`;
      revealObserver.observe(child);
    }
  });
});

// Science list items (staggered)
document.querySelectorAll('.science-list').forEach(list => {
  Array.from(list.children).forEach((child, i) => {
    child.classList.add('reveal', 'reveal-up');
    child.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(child);
  });
});

// Product hero
document.querySelectorAll('.product-visual, .product-info').forEach(el => {
  if (!el.classList.contains('reveal')) {
    el.classList.add('reveal', 'reveal-up');
    revealObserver.observe(el);
  }
});

// Image headers (fade in)
document.querySelectorAll('.image-header .container').forEach(el => {
  el.classList.add('reveal', 'reveal-up');
  revealObserver.observe(el);
});

// ===== Parallax on Hero Image (homepage only) =====
const heroImg = document.querySelector('.hero-image-bg');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
    }
  });
  heroImg.style.transform = 'scale(1.1)';
  heroImg.style.transition = 'transform 0.1s linear';
}

// ===== Parallax-like Scroll Effect on Split Section Images =====
const splitImages = document.querySelectorAll('.split-image img');
if (splitImages.length > 0) {
  window.addEventListener('scroll', () => {
    splitImages.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const offset = (progress - 0.5) * 30;
        img.style.transform = `translateY(${offset}px) scale(1.03)`;
      }
    });
  });
}

// ===== Animated Bar Charts =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.bar-fill');
      fills.forEach((fill, i) => {
        const width = fill.getAttribute('data-width');
        if (width) {
          setTimeout(() => {
            fill.style.width = width;
          }, i * 200);
        }
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.bar-chart').forEach(chart => {
  barObserver.observe(chart);
});

// ===== Keyboard Accessibility =====
document.addEventListener('keydown', (e) => {
  // Close modal on Escape
  if (e.key === 'Escape' && emailModal && emailModal.classList.contains('active')) {
    emailModal.classList.remove('active');
    sessionStorage.setItem('zeph-modal-dismissed', 'true');
  }
});
