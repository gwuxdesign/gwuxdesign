(function () {
  const FUNCTION_ENDPOINT = "http://localhost:7071/api/Contact";

  const form = document.getElementById("contact-form");
  const confirmation = document.getElementById("contact-confirmation");
  if (!form) return;

  const statusEl = form.querySelector(".form-status");

  const validators = {
    name: (value) => (value.trim().length > 0 ? "" : "Please enter your name."),
    email: (value) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value.trim()) ? "" : "Please enter a valid email address.";
    },
    message: (value) => (value.trim().length > 0 ? "" : "Please enter a message."),
  };

  function showFieldError(fieldName, message) {
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message;
  }

  function validateForm() {
    let isValid = true;
    Object.keys(validators).forEach((fieldName) => {
      const field = form.elements[fieldName];
      const error = validators[fieldName](field.value);
      showFieldError(fieldName, error);
      if (error) isValid = false;
    });
    return isValid;
  }

  Object.keys(validators).forEach((fieldName) => {
    form.elements[fieldName].addEventListener("blur", () => {
      showFieldError(fieldName, validators[fieldName](form.elements[fieldName].value));
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      statusEl.textContent = "Please fix the errors above.";
      return;
    }

    const turnstileField = document.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileField || !turnstileField.value) {
      statusEl.textContent = "Please complete the CAPTCHA challenge.";
      return;
    }

    statusEl.textContent = "Sending...";

    try {
      const response = await fetch(FUNCTION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.elements.name.value,
          email: form.elements.email.value,
          message: form.elements.message.value,
          turnstileToken: turnstileField.value,
        }),
      });

      if (response.ok) {
        form.hidden = true;
        confirmation.hidden = false;
      } else {
        statusEl.textContent = "Something went wrong. Please try again.";
      }
    } catch (error) {
      statusEl.textContent = "Something went wrong. Please try again.";
      console.error("Contact form submission failed:", error);
    }
  });
})();