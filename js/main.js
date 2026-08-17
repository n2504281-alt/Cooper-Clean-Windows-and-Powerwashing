/**
 * COOPER CLEAN WINDOWS & POWERWASHING - INTERACTIVE LOGIC
 * Location: Tyler, Texas
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. STICKY HEADER & ACTIVE NAV LINKS
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

    // Active Section Highlight
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
     2. MOBILE NAVIGATION MENU TOGGLE
     ------------------------------------------------------------------------ */
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. BEFORE / AFTER INTERACTIVE SLIDER
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
     4. FAQ ACCORDION
     ------------------------------------------------------------------------ */
  const faqButtons = document.querySelectorAll('.faq-button');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive && answer) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & TOAST
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
        alert('Please fill out all required fields (Name, Phone, and Service Needed).');
        return;
      }

      // Show success toast feedback
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
