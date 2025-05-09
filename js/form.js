(function() {
  const openBtn       = document.getElementById('openContactModal');
  const modal         = document.getElementById('contactModal');
  const closeBtn      = document.getElementById('closeContactModal');
  const form          = document.getElementById('contactForm');
  const toast         = document.getElementById('toast');
  const fields        = ['name', 'email', 'phone', 'message'];
  const maxEmailLen   = 64;
  let lastFocus;

  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show', 'success', 'error'), 5000);
  }

  function clearErrors() {
    fields.forEach(id => {
      const err = document.getElementById(`${id}Error`);
      if (err) err.textContent = '';
    });
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    lastFocus && lastFocus.focus();
  }

  openBtn.addEventListener('click', () => {
    lastFocus = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    form.reset();
    clearErrors();
    document.getElementById('name').focus();
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    let valid = true;
    const nameVal    = form.name.value.trim();
    const emailVal   = form.email.value.trim();
    const phoneVal   = form.phone.value.trim();
    const messageVal = form.message.value.trim();

    const nameWords = nameVal.split(/\s+/).filter(w => w);
    const nameChars = nameVal.replace(/\s+/g, '');
    if (!nameVal) {
      document.getElementById('nameError').textContent = 'Name is required.';
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nameVal)) {
      document.getElementById('nameError').textContent = 'Invalid name. Use letters and spaces only.';
      valid = false;
    } else if (nameWords.length < 2) {
      document.getElementById('nameError').textContent = 'Enter at least two words.';
      valid = false;
    } else if (nameChars.length < 4 || nameChars.length > 32) {
      document.getElementById('nameError').textContent = 'Name must be 4–32 characters (excluding spaces).';
      valid = false;
    }

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailVal) {
      document.getElementById('emailError').textContent = 'Email is required.';
      valid = false;
    } else if (emailVal.length > maxEmailLen) {
      document.getElementById('emailError').textContent = `Email must be at most ${maxEmailLen} characters.`;
      valid = false;
    } else if (!emailPattern.test(emailVal)) {
      document.getElementById('emailError').textContent = 'Invalid email. Use user@example.com.';
      valid = false;
    }

    const phonePattern = /^\+[1-9]\d{7,14}$/;
    if (!phoneVal) {
      document.getElementById('phoneError').textContent = 'Phone number is required.';
      valid = false;
    } else if (!phonePattern.test(phoneVal)) {
      document.getElementById('phoneError').textContent = 'Invalid phone. Use +[country code][number].';
      valid = false;
    }

    if (!messageVal) {
      document.getElementById('messageError').textContent = 'Message is required.';
      valid = false;
    } else if (messageVal.length < 10 || messageVal.length > 1000) {
      document.getElementById('messageError').textContent = 'Message must be 10–1000 characters.';
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch('../php/form.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameVal, email: emailVal, phone: phoneVal, message: messageVal })
      });
      const result = await res.json();

      if (result.success) {
        showToast('Your message has been sent!', 'success');
        closeModal();
      } else if (result.errors) {
        Object.entries(result.errors).forEach(([field, msg]) => {
          const errEl = document.getElementById(field + 'Error');
          if (errEl) errEl.textContent = msg;
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      showToast('Submission failed. Please try again.', 'error');
      console.error(err);
    }
  });
})();