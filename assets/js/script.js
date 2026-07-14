// ============================================================
// RAISE — Thiago Fonseca | script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu after clicking a link (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Fade-up on scroll
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));

  // Header background on scroll (subtle elevation)
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 12) {
        header.style.boxShadow = '0 8px 24px -16px rgba(0,0,0,0.6)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }

  // Diagnostic form: envio assincrono para o Google Apps Script
  const diagnosticForm = document.getElementById('diagnosticForm');
  const formStatus = document.getElementById('formStatus');

  if (diagnosticForm && formStatus) {
    diagnosticForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const endpoint = diagnosticForm.dataset.endpoint;
      const submitBtn = diagnosticForm.querySelector('button[type="submit"]');
      const formData = new FormData(diagnosticForm);

      formStatus.className = 'form-status';
      formStatus.textContent = '';

      if (!endpoint || endpoint.indexOf('SEU_SCRIPT_ID') !== -1) {
        formStatus.textContent = 'Formulário em configuração. Entre em contato pelo LinkedIn ou e-mail.';
        formStatus.classList.add('form-status--error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      })
        .then(() => {
          formStatus.textContent = 'Recebido! Em breve entrarei em contato para os próximos passos do Diagnóstico Estratégico.';
          formStatus.classList.add('form-status--success');
          diagnosticForm.reset();
        })
        .catch(() => {
          formStatus.textContent = 'Não foi possível enviar agora. Tente novamente ou escreva para inteligencia.raise@gmail.com.';
          formStatus.classList.add('form-status--error');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar Diagnóstico Estratégico';
          }
        });
    });
  }
});
