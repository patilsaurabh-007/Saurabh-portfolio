/**
 * Saurabh Patil - Engineering Student & Developer Portfolio
 * Interactive Scripts & Event Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Typing / Role Rotation Effect
  const roles = [
    'Engineering Student',
    'Aspiring Software Engineer',
    'Database & SQL Enthusiast',
    'Web Application Builder',
    'Logical Problem Solver'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const roleTextEl = document.getElementById('roleText');
  const typeSpeed = 100;
  const eraseSpeed = 50;
  const holdDelay = 1800;

  function typeRoleEffect() {
    if (!roleTextEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      roleTextEl.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      roleTextEl.textContent = currentRole.substring(0, charIndex);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
        typeRoleEffect();
      }, holdDelay);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRoleEffect, 300);
      return;
    }

    setTimeout(typeRoleEffect, isDeleting ? eraseSpeed : typeSpeed);
  }
  typeRoleEffect();

  // 3. Theme Toggle (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Retrieve stored theme or system preference
  const savedTheme = localStorage.getItem('saurabh_portfolio_theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', targetTheme);
      localStorage.setItem('saurabh_portfolio_theme', targetTheme);
      showToast(`Switched to ${targetTheme} theme`);
    });
  }

  // 4. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta a');

  function toggleMobileMenu() {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileDrawer.classList.toggle('active');
    mobileDrawer.setAttribute('aria-hidden', isExpanded);
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('active') &&
        !mobileDrawer.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 5. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // 6. Toast Notification Helper
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 7. Copy to Clipboard Functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else if (textToCopy) {
        fallbackCopyText(textToCopy);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`);
    } catch (err) {
      showToast('Could not copy automatically');
    }
    document.body.removeChild(textArea);
  }

  // 8. Modals (CampusPay & Resume)
  const projectModal = document.getElementById('projectModal');
  const openCampusPayModal = document.getElementById('openCampusPayModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModalBottomBtn = document.getElementById('closeModalBottomBtn');

  const resumeModal = document.getElementById('resumeModal');
  const resumeBtn = document.getElementById('resumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const closeResumeBottomBtn = document.getElementById('closeResumeBottomBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openCampusPayModal && projectModal) {
    openCampusPayModal.addEventListener('click', () => openModal(projectModal));
  }
  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => closeModal(projectModal));
  }
  if (closeModalBottomBtn && projectModal) {
    closeModalBottomBtn.addEventListener('click', () => closeModal(projectModal));
  }

  if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', () => openModal(resumeModal));
  }
  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => closeModal(resumeModal));
  }
  if (closeResumeBottomBtn && resumeModal) {
    closeResumeBottomBtn.addEventListener('click', () => closeModal(resumeModal));
  }

  // Print Resume Handler
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on overlay backdrop click
  [projectModal, resumeModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('active')) {
        closeModal(projectModal);
      }
      if (resumeModal && resumeModal.classList.contains('active')) {
        closeModal(resumeModal);
      }
    }
  });

  // 9. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('nameInput').value.trim();
      const email = document.getElementById('emailInput').value.trim();
      const subject = document.getElementById('subjectInput').value.trim();
      const message = document.getElementById('messageInput').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Generate mailto link
      const mailtoUrl = `mailto:sp1822007@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(
        `Hi Saurabh,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      showToast('Opening email client to send message...');
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 600);
    });
  }

  // 10. Interactive Cursor Spotlight for Bespoke Background
  const cursorSpotlight = document.getElementById('cursorSpotlight');
  if (cursorSpotlight && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 3;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMouseActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMouseActive) {
        isMouseActive = true;
        cursorSpotlight.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      isMouseActive = false;
      cursorSpotlight.style.opacity = '0';
    });

    function renderSpotlight() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      cursorSpotlight.style.left = `${currentX}px`;
      cursorSpotlight.style.top = `${currentY}px`;
      requestAnimationFrame(renderSpotlight);
    }
    requestAnimationFrame(renderSpotlight);
  }
});
