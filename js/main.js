/**
 * COOPER CLEAN WINDOWS & POWERWASHING - INTERACTIVE LOGIC (V2 OVERHAUL)
 * Location: Tyler, Texas
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. STICKY HEADER & SCROLL HIGHLIGHTS
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* ------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     ------------------------------------------------------------------------ */
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. TESTIMONIAL CAROUSEL SLIDER
     ------------------------------------------------------------------------ */
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (track && cards.length > 0) {
    let currentIndex = 0;
    let autoSlideTimer = null;

    const getVisibleCards = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const maxIndex = () => Math.max(0, cards.length - getVisibleCards());

    // Create Dots
    const renderDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const totalDots = maxIndex() + 1;
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateSliderPosition = () => {
      if (cards[0]) {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 32; // 2rem gap
        const amountToMove = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${amountToMove}px)`;
      }

      // Update Dots
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      if (currentIndex > maxIndex()) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIndex();
      updateSliderPosition();
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    const startAutoSlide = () => {
      autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    renderDots();
    updateSliderPosition();
    startAutoSlide();

    window.addEventListener('resize', () => {
      renderDots();
      goToSlide(Math.min(currentIndex, maxIndex()));
    });
  }

  /* ------------------------------------------------------------------------
     4. BEFORE / AFTER INTERACTIVE SLIDER
     ------------------------------------------------------------------------ */
  const container = document.querySelector('.ba-slider-container');
  const beforeImg = document.querySelector('.ba-before');
  const handle = document.querySelector('.ba-handle');

  if (container && beforeImg && handle) {
    let isDragging = false;

    const setSliderPosition = (x) => {
      const rect = container.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      setSliderPosition(e.clientX || e.touches[0].clientX);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX || (e.touches && e.touches[0].clientX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  /* ------------------------------------------------------------------------
     5. PROCESS ANIMATED LINE PROGRESS ON SCROLL
     ------------------------------------------------------------------------ */
  const processSection = document.querySelector('.process-section');
  const progressBar = document.querySelector('.process-line-progress');

  if (processSection && progressBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBar.style.width = '100%';
        }
      });
    }, { threshold: 0.3 });

    observer.observe(processSection);
  }

  /* ------------------------------------------------------------------------
     6. STAT COUNTER ANIMATION
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.counter-num');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      const isDecimal = target % 1 !== 0;
      let current = 0;
      const duration = 1500;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.floor(target).toString();
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toString();
        }
      }, stepTime);
    });
  };

  const counterSection = document.querySelector('.google-reviews-section');
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(counterSection);
  }

  /* ------------------------------------------------------------------------
     7. FAQ ACCORDION
     ------------------------------------------------------------------------ */
  const faqButtons = document.querySelectorAll('.faq-button');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive && answer) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. QUOTE FORM SUBMISSION & TOAST
     ------------------------------------------------------------------------ */
  const quoteForm = document.getElementById('quoteForm');
  const toastSuccess = document.getElementById('toastSuccess');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName')?.value.trim();
      const phone = document.getElementById('phoneNumber')?.value.trim();
      const service = document.getElementById('serviceNeeded')?.value;

      if (!name || !phone || !service) {
        alert('Please fill out all required fields.');
        return;
      }

      if (toastSuccess) {
        toastSuccess.style.display = 'block';
        toastSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      quoteForm.reset();

      setTimeout(() => {
        if (toastSuccess) toastSuccess.style.display = 'none';
      }, 7000);
    });
  }
});
