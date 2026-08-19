/* =========================================================
   SHRISH GROUP — CONTACT FORM
   Resend / Netlify Function Submission
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const form = document.getElementById("contactForm");

  if (!form) return;

  const status = document.getElementById("formStatus");

  const submitButton = form.querySelector('button[type="submit"]');

  /* =====================================================
       ERROR HELPERS
       ===================================================== */

  function setError(field, message) {
    const group = field.closest(".form-group");

    if (!group) return;

    group.classList.add("invalid");

    const error = group.querySelector(".field-error");

    if (error) {
      error.textContent = message;
    }
  }

  function clearError(field) {
    const group = field.closest(".form-group");

    if (!group) return;

    group.classList.remove("invalid");

    const error = group.querySelector(".field-error");

    if (error) {
      error.textContent = "";
    }
  }

  /* =====================================================
       VALIDATION
       ===================================================== */

  function validateForm() {
    let valid = true;

    const name = form.elements["name"];

    const email = form.elements["email"];

    const phone = form.elements["phone"];

    const division = form.elements["division"];

    const message = form.elements["message"];

    [name, email, phone, division, message].forEach(clearError);

    if (!name.value.trim() || name.value.trim().length < 3) {
      setError(name, "Please enter your full name.");

      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setError(email, "Please enter a valid email address.");

      valid = false;
    }

    if (!/^[+]?[\d\s()-]{10,16}$/.test(phone.value.trim())) {
      setError(phone, "Please enter a valid phone number.");

      valid = false;
    }

    if (!division.value) {
      setError(division, "Please select a division.");

      valid = false;
    }

    if (message.value.trim().length < 15) {
      setError(message, "Please add at least 15 characters.");

      valid = false;
    }

    return valid;
  }

  /* =====================================================
       LIVE ERROR CLEARING
       ===================================================== */

  form.addEventListener("input", (event) => {
    if (event.target.closest(".form-group")) {
      clearError(event.target);
    }
  });

  form.addEventListener("change", (event) => {
    if (event.target.closest(".form-group")) {
      clearError(event.target);
    }
  });

  /* =====================================================
       STATUS
       ===================================================== */

  function showStatus(type, message) {
    if (!status) return;

    status.className = `form-status ${type}`;

    status.textContent = message;
  }

  /* =====================================================
       SUBMIT
       ===================================================== */

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    showStatus("", "");

    if (!validateForm()) {
      showStatus(
        "error",
        "Please correct the highlighted fields and try again.",
      );

      return;
    }

    /* Disable button */

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Sending...
                    `;
    }

    try {
      const formData = new FormData(form);

      const data = {
        name: formData.get("name")?.trim(),

        email: formData.get("email")?.trim(),

        phone: formData.get("phone")?.trim(),

        division: formData.get("division")?.trim(),

        message: formData.get("message")?.trim(),
      };

      /* =========================================
                   SEND TO NETLIFY FUNCTION
                   ========================================= */

      const response = await fetch("/.netlify/functions/send-contact-email", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send your enquiry.");
      }

      /* =========================================
                   SUCCESS
                   ========================================= */

      showStatus(
        "success",
        "Thank you. Your enquiry has been sent successfully. Our team will get back to you shortly.",
      );

      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      showStatus(
        "error",
        "We couldn't send your enquiry right now. Please try again or contact us directly.",
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML = `
                        <i class="fa-solid fa-paper-plane"></i>
                        Send enquiry
                        `;
      }
    }
  });
});
