/**
 * =================================================================
 * The Bloom Bridge - Performance-Driven Motion Scripts
 * =================================================================
 * Employs hardware-accelerated IntersectionObservers to trigger 
 * elegant visual entries (fading & sliding) as elements enter the viewport.
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeScrollAnimations();
});

/**
 * High-Performance IntersectionObserver triggers
 */
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-reveal, .fade-in-element');

  if (!animatedElements.length) return;

  // Configuration optimized for natural smooth transitions
  const animationOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Triggers slightly before crossing into full view
    threshold: 0.05
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Stop observing once element is visible to save CPU cycles
        observer.unobserve(entry.target);
      }
    });
  }, animationOptions);

  animatedElements.forEach(element => {
    animationObserver.observe(element);
  });
}
