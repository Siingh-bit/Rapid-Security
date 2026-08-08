document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. LOADING SCREEN
     ========================================================================== */
  const loader = document.querySelector('.loader');
  if (loader) {
    let isHidden = false;
    const hideLoader = () => {
      if (isHidden) return;
      isHidden = true;
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s ease';
      loader.addEventListener('transitionend', () => {
        loader.style.display = 'none';
      }, { once: true });
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 150);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 150), { once: true });
      setTimeout(hideLoader, 1200);
    }
  }

  /* ==========================================================================
     2. NAVBAR SCROLL EFFECT
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const SCROLL_THRESHOLD = 50;

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ==========================================================================
     3. MOBILE MENU TOGGLE
     ========================================================================== */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded',
        navLinks.classList.contains('active').toString()
      );
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     4. SMOOTH SCROLL
     ========================================================================== */
  const NAVBAR_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ==========================================================================
     5. SCROLL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay, 10) || 0;
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, delay);
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach((el) => scrollObserver.observe(el));
  }

  /* ==========================================================================
     6. STAT COUNTER ANIMATION
     ========================================================================== */
  const formatNumber = (num) => {
    return Math.floor(num).toLocaleString('en-US');
  };

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const statNumbers = document.querySelectorAll('.stat-number, .why-number');

  if (statNumbers.length > 0) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    statNumbers.forEach((el) => statObserver.observe(el));
  }

  /* ==========================================================================
     7. GALLERY LIGHTBOX
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img') || (() => {
      const img = document.createElement('img');
      lightbox.appendChild(img);
      return img;
    })();

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = [];

    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        images.push({
          src: img.dataset.full || img.src,
          alt: img.alt || `Gallery image ${index + 1}`,
        });
      }

      item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
      });
    });

    const openLightbox = () => {
      if (images.length === 0) return;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ==========================================================================
     8. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTop = document.querySelector('.back-to-top');
  const BACK_TO_TOP_THRESHOLD = 500;

  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > BACK_TO_TOP_THRESHOLD) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     9. ACTIVE NAV LINK HIGHLIGHT
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0 && navLinkItems.length > 0) {
    const activeLinkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinkItems.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        rootMargin: `-${NAVBAR_OFFSET}px 0px -40% 0px`,
        threshold: 0,
      }
    );

    sections.forEach((section) => activeLinkObserver.observe(section));
  }

  /* ==========================================================================
     10. CONTACT FORM VALIDATION
     ========================================================================== */
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    const showAlert = (message, type = 'success') => {
      const existingAlert = document.querySelector('.form-alert');
      if (existingAlert) existingAlert.remove();

      const alert = document.createElement('div');
      alert.className = `form-alert form-alert--${type}`;
      alert.innerHTML = `
        <span>${message}</span>
        <button class="form-alert__close" aria-label="Close">&times;</button>
      `;

      contactForm.parentNode.insertBefore(alert, contactForm.nextSibling);

      alert.querySelector('.form-alert__close').addEventListener('click', () => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        alert.addEventListener('transitionend', () => alert.remove(), { once: true });
      });

      requestAnimationFrame(() => {
        alert.style.opacity = '1';
        alert.style.transform = 'translateY(0)';
      });

      setTimeout(() => {
        if (alert.parentNode) {
          alert.style.opacity = '0';
          alert.style.transform = 'translateY(-10px)';
          alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          alert.addEventListener('transitionend', () => alert.remove(), { once: true });
        }
      }, 5000);
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const clearFieldError = (field) => {
      field.classList.remove('error');
      const errorMsg = field.parentElement.querySelector('.field-error');
      if (errorMsg) errorMsg.remove();
    };

    const setFieldError = (field, message) => {
      field.classList.add('error');
      const existing = field.parentElement.querySelector('.field-error');
      if (existing) existing.remove();
      const errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.textContent = message;
      field.parentElement.appendChild(errorEl);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const phone = contactForm.querySelector('[name="phone"]');
      const message = contactForm.querySelector('[name="message"]');

      let isValid = true;

      const requiredFields = [
        { el: name, label: 'Name' },
        { el: email, label: 'Email' },
        { el: message, label: 'Message' },
      ];

      requiredFields.forEach(({ el, label }) => {
        if (!el) return;
        clearFieldError(el);
        if (!el.value.trim()) {
          setFieldError(el, `${label} is required.`);
          isValid = false;
        }
      });

      if (email && email.value.trim() && !validateEmail(email.value.trim())) {
        setFieldError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      if (phone && phone.value.trim()) {
        clearFieldError(phone);
        const digits = phone.value.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
          setFieldError(phone, 'Please enter a valid phone number.');
          isValid = false;
        }
      }

      if (!isValid) {
        showAlert('Please correct the errors above.', 'error');
        return;
      }

      showAlert('Thank you! Your message has been sent successfully. We\'ll get back to you shortly.', 'success');
      contactForm.reset();

      contactForm.querySelectorAll('.error').forEach((el) => clearFieldError(el));
    });

    contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => clearFieldError(field));
    });
  }

  /* ==========================================================================
     11. TYPING EFFECT
     ========================================================================== */
  const typingElement = document.querySelector('.typing-text');

  if (typingElement) {
    const strings = [
      'Residential Complexes',
      'Corporate Offices',
      'Commercial Spaces',
      'Industrial Facilities',
      'Event Venues',
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 500;

    const type = () => {
      const currentString = strings[stringIndex];

      if (!isDeleting) {
        typingElement.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentString.length) {
          isDeleting = true;
          setTimeout(type, pauseAfterType);
          return;
        }

        setTimeout(type, typeSpeed);
      } else {
        typingElement.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(type, pauseAfterDelete);
          return;
        }

        setTimeout(type, deleteSpeed);
      }
    };

    type();
  }

  /* ==========================================================================
     12. TESTIMONIAL CAROUSEL SLIDER
     ========================================================================== */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialDotsContainer = document.getElementById('testimonialDots');

  if (testimonialTrack && testimonialDotsContainer) {
    const cards = testimonialTrack.querySelectorAll('.testimonial-card');
    const dots = testimonialDotsContainer.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoSlideInterval = null;

    const goToSlide = (index) => {
      currentIndex = index;
      testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === currentIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoSlide();
      });
    });

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % cards.length;
        goToSlide(nextIndex);
      }, 5000);
    };

    const resetAutoSlide = () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();

    const carouselContainer = document.querySelector('.testimonial-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
      });
      carouselContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
      });
    }
  }
});

