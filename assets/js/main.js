/**
 * =================================================================
 * The Bloom Bridge - Core Navigation & Interactive Scripting
 * =================================================================
 * Manages header scrolling effects, high-performance IntersectionObserver 
 * scroll-spying, mobile overlay navigation, and testimonial carousels.
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeHeaderScroll();
  initializeMobileNavigation();
  initializeScrollSpying();
  initializeTestimonialCarousel();
});

/**
 * 1. Header scroll changes (adds background shadowing when page is scrolled)
 */
function initializeHeaderScroll() {
  const header = document.getElementById('global-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * 2. Mobile Navigation Toggle (Hamburger overlay)
 */
function initializeMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    });
  });
}

/**
 * 3. High-Performance IntersectionObserver Scroll-Spying
 * Tracks which section is currently centered in the viewport,
 * dynamically highlighting the matching nav-link and sliding the underline bar.
 */
function initializeScrollSpying() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.contact-cta)');
  const indicatorBar = document.getElementById('active-nav-indicator');

  if (!sections.length || !navLinks.length || !indicatorBar) return;

  const linkMap = new Map();
  navLinks.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    linkMap.set(targetId, link);
  });

  // Slide indicator bar to the active link
  const updateIndicator = (activeLink) => {
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (activeLink) {
      activeLink.classList.add('active');
      
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement.parentElement.getBoundingClientRect();
      
      // Calculate offset inside the navigation list container
      const leftOffset = rect.left - parentRect.left;
      
      indicatorBar.style.left = `${leftOffset}px`;
      indicatorBar.style.width = `${rect.width}px`;
    } else {
      indicatorBar.style.width = '0';
    }
  };

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Triggers when section occupies the upper-middle region
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeSectionId = entry.target.getAttribute('id');
        const matchingLink = linkMap.get(activeSectionId);
        
        if (matchingLink) {
          updateIndicator(matchingLink);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => spyObserver.observe(section));

  // Handle window resizing to keep underline aligned
  window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
      updateIndicator(activeLink);
    }
  }, { passive: true });
}

/**
 * 4. Premium Testimonial Carousel Interaction
 * Handles dots, arrow triggers, and smooth auto-slide cycles.
 */
function initializeTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev-arrow');
  const nextBtn = document.getElementById('carousel-next-arrow');
  
  if (!slides.length || !dots.length) return;

  let currentIndex = 0;
  let autoCycleTimer = null;
  const cycleInterval = 8000; // 8 seconds per slide

  const showSlide = (index) => {
    // Wrap around boundaries
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    currentIndex = index;

    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  };

  const startAutoCycle = () => {
    stopAutoCycle();
    autoCycleTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, cycleInterval);
  };

  const stopAutoCycle = () => {
    if (autoCycleTimer) {
      clearInterval(autoCycleTimer);
    }
  };

  // Dot triggers
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-slide-index'), 10);
      showSlide(targetIndex);
      startAutoCycle(); // Reset timer
    });
  });

  // Next Arrow trigger
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoCycle();
    });
  }

  // Prev Arrow trigger
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAutoCycle();
    });
  }

  // Pause on hover
  const carouselRegion = document.getElementById('testimonial-carousel');
  if (carouselRegion) {
    carouselRegion.addEventListener('mouseenter', stopAutoCycle);
    carouselRegion.addEventListener('mouseleave', startAutoCycle);
  }

  // Initial activation
  showSlide(0);
  startAutoCycle();
}
