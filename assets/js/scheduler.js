/**
 * =================================================================
 * The Bloom Bridge - Double Intake Portal Controller
 * =================================================================
 * Manages tab toggles (Calendly scheduling vs. Inquiry form),
 * interactive mock slot booking animations, and premium form validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeIntakeTabs();
  initializeMockScheduler();
  initializeInquiryFormValidation();
});

/**
 * 1. Intake Tabs Toggling
 */
function initializeIntakeTabs() {
  const tabs = document.querySelectorAll('.intake-tab-btn');
  const panels = document.querySelectorAll('.intake-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Deactivate all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      // 2. Hide all panels
      panels.forEach(p => {
        p.classList.remove('active');
      });

      // 3. Activate current tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');

      // 4. Reveal matching panel
      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });

    // Accessible arrow key navigation for tabs
    tab.addEventListener('keydown', (e) => {
      const tabList = Array.from(tabs);
      const index = tabList.indexOf(tab);
      let nextTab = null;

      if (e.key === 'ArrowRight') {
        nextTab = tabList[index + 1] || tabList[0];
      } else if (e.key === 'ArrowLeft') {
        nextTab = tabList[index - 1] || tabList[tabList.length - 1];
      }

      if (nextTab) {
        nextTab.focus();
        nextTab.click();
      }
    });
  });
}

/**
 * 2. Interactive Mock Calendly Scheduler
 * Standardized mock to provide a premium interactive booking experience.
 */
function initializeMockScheduler() {
  const slots = document.querySelectorAll('.slot-time-btn');
  const confirmPane = document.getElementById('scheduler-confirm-pane');
  const successPane = document.getElementById('scheduler-success-pane');
  const slotSummaryText = document.getElementById('selected-slot-summary');
  const confirmBtn = document.getElementById('sched-confirm-action');
  
  const schedNameInput = document.getElementById('sched-name');
  const schedEmailInput = document.getElementById('sched-email');
  const slotsGrid = document.querySelector('.scheduler-slots-grid');

  if (!slots.length || !confirmPane || !confirmBtn) return;

  let selectedTimeDetails = '';

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      // De-select other slots
      slots.forEach(s => s.classList.remove('selected'));
      
      // Select clicked slot
      slot.classList.add('selected');
      
      // Extract details
      const parentCol = slot.parentElement;
      const dateString = parentCol.querySelector('.column-date').textContent;
      const timeString = slot.getAttribute('data-time');
      
      selectedTimeDetails = `${dateString} at ${timeString}`;
      slotSummaryText.textContent = selectedTimeDetails;

      // Smooth reveal confirmation form
      confirmPane.style.display = 'block';
      confirmPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const nameVal = schedNameInput.value.trim();
    const emailVal = schedEmailInput.value.trim();
    const phoneInput = document.getElementById('sched-phone');
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const phoneCodeInput = document.getElementById('sched-phone-code');
    const phoneCodeVal = phoneCodeInput ? phoneCodeInput.value : '+91';

    const errName = document.getElementById('err-sched-name');
    const errEmail = document.getElementById('err-sched-email');
    const errPhone = document.getElementById('err-sched-phone');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullPhone = phoneCodeVal + phoneVal;
    const cleanPhone = fullPhone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+[1-9]\d{7,14}$/;

    let isValid = true;

    if (!nameVal) {
      isValid = false;
      if (errName) errName.style.display = 'block';
      schedNameInput.classList.add('invalid');
    } else {
      if (errName) errName.style.display = 'none';
      schedNameInput.classList.remove('invalid');
    }

    if (!emailVal || !emailRegex.test(emailVal)) {
      isValid = false;
      if (errEmail) errEmail.style.display = 'block';
      schedEmailInput.classList.add('invalid');
    } else {
      if (errEmail) errEmail.style.display = 'none';
      schedEmailInput.classList.remove('invalid');
    }

    if (!phoneVal || !phoneRegex.test(cleanPhone)) {
      isValid = false;
      if (errPhone) errPhone.style.display = 'block';
      if (phoneInput) phoneInput.classList.add('invalid');
    } else {
      if (errPhone) errPhone.style.display = 'none';
      if (phoneInput) phoneInput.classList.remove('invalid');
    }

    if (!isValid) return;

    // Hide input and slots fields
    slotsGrid.style.display = 'none';
    confirmPane.style.display = 'none';

    // Reveal success pane
    successPane.style.display = 'block';
  });
}

/**
 * 3. Inquiry Form Validation & Success Overlay Actions
 */
function initializeInquiryFormValidation() {
  const form = document.getElementById('corporate-inquiry-form');
  const successOverlay = document.getElementById('inquiry-success-view');
  const resetBtn = document.getElementById('btn-reset-form');

  if (!form || !successOverlay || !resetBtn) return;

  const inputs = {
    name: { el: document.getElementById('contact-name'), err: document.getElementById('err-name') },
    email: { el: document.getElementById('contact-email'), err: document.getElementById('err-email') },
    phone: { el: document.getElementById('contact-phone'), err: document.getElementById('err-phone') },
    company: { el: document.getElementById('contact-company'), err: document.getElementById('err-company') },
    interest: { el: document.getElementById('contact-interest'), err: document.getElementById('err-interest') }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (fieldKey) => {
    const field = inputs[fieldKey];
    if (!field.el) return true;

    let isValid = true;
    const val = field.el.value.trim();

    if (!val) {
      if (fieldKey !== 'company') {
        isValid = false;
      }
    } else if (fieldKey === 'email' && !emailRegex.test(val)) {
      isValid = false;
    } else if (fieldKey === 'phone') {
      const phoneCodeInput = document.getElementById('contact-phone-code');
      const phoneCodeVal = phoneCodeInput ? phoneCodeInput.value : '+91';
      const fullPhone = phoneCodeVal + val;
      const cleanPhone = fullPhone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^\+[1-9]\d{7,14}$/;
      if (!phoneRegex.test(cleanPhone)) {
        isValid = false;
      }
    }

    if (isValid) {
      field.err.style.display = 'none';
      field.el.classList.remove('invalid');
    } else {
      field.err.style.display = 'block';
      field.el.classList.add('invalid');
    }

    return isValid;
  };

  // Add real-time blur listeners
  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    if (input.el) {
      input.el.addEventListener('blur', () => validateField(key));
      input.el.addEventListener('input', () => {
        if (input.el.classList.contains('invalid')) {
          validateField(key);
        }
      });
    }
  });

  // Form submit intercept
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formValid = true;
    Object.keys(inputs).forEach(key => {
      const isFieldValid = validateField(key);
      if (!isFieldValid) {
        formValid = false;
      }
    });

    if (formValid) {
      // Smooth trigger of success panel overlay
      successOverlay.style.display = 'flex';
    }
  });

  // Reset form trigger
  resetBtn.addEventListener('click', () => {
    form.reset();
    successOverlay.style.display = 'none';
    
    // Hide error messages
    Object.keys(inputs).forEach(key => {
      inputs[key].err.style.display = 'none';
      inputs[key].el.classList.remove('invalid');
    });
  });
}
