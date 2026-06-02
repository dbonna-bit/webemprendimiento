/* =========================================
   ALBANY GIRALDO DECOR — main.js
   Lógica: nav móvil, scroll, animaciones,
   filtros de portafolio, formulario seguro,
   rate-limiting, política de privacidad.
   ========================================= */

(function () {
    'use strict';

    // CAMBIAR: reemplazar xABCDEFG por el endpoint real de Formspree
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xABCDEFG';

    const RATE_LIMIT_SECONDS = 60;
    const RATE_LIMIT_KEY = 'agd_last_submit';

    document.documentElement.classList.remove('no-js');

    /* -----------------------------------------
       NAV: scroll background + mobile menu
       ----------------------------------------- */
    const nav = document.getElementById('topnav');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const onScrollNav = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    const closeMobileMenu = () => {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('is-open');
    };

    hamburger.addEventListener('click', () => {
        if (hamburger.classList.contains('is-open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });

    /* -----------------------------------------
       ACTIVE NAV LINK al hacer scroll
       ----------------------------------------- */
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinksDesktop = document.querySelectorAll('#nav-links-desktop .nav-link');

    const updateActiveLink = () => {
        const scrollY = window.scrollY + 120;
        let current = '';
        sections.forEach(s => {
            if (scrollY >= s.offsetTop) current = s.id;
        });
        navLinksDesktop.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* -----------------------------------------
       REVEAL ON SCROLL con IntersectionObserver
       ----------------------------------------- */
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }

    /* -----------------------------------------
       PORTAFOLIO — Filtros
       ----------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            projectCards.forEach(card => {
                const matches = filter === 'all' || card.dataset.category === filter;
                if (matches) {
                    card.classList.remove('is-hidden');
                    card.classList.remove('is-filtering');
                    void card.offsetWidth;
                    card.classList.add('is-filtering');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    /* -----------------------------------------
       BACK TO TOP
       ----------------------------------------- */
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* -----------------------------------------
       YEAR en footer
       ----------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* -----------------------------------------
       PRIVACY MODAL
       ----------------------------------------- */
    const modal = document.getElementById('privacy-modal');
    const openBtns = [document.getElementById('open-privacy'), document.getElementById('open-privacy-footer')];
    const closeBtn = document.getElementById('close-privacy');

    const openModal = () => {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.add('is-visible'));
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
        modal.classList.remove('is-visible');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };
    openBtns.forEach(b => b && b.addEventListener('click', openModal));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    /* -----------------------------------------
       FORMULARIO — Validación + Sanitización +
       Honeypot + Rate-limiting + Formspree
       ----------------------------------------- */
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitLabel = document.getElementById('submit-label');
    const submitArrow = document.getElementById('submit-arrow');
    const submitSpinner = document.getElementById('submit-spinner');
    const formWrapper = document.getElementById('form-wrapper');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const resetBtn = document.getElementById('reset-form');
    const retryBtn = document.getElementById('retry-form');
    const msgCounter = document.getElementById('msg-counter');
    const messageField = document.getElementById('message');

    // Sanitizador — escapa HTML para prevenir XSS
    function sanitizeInput(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .trim();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function setError(fieldName, msg) {
        const errEl = form.querySelector(`.field-error[data-for="${fieldName}"]`);
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (errEl) errEl.textContent = msg || '';
        if (field) {
            const wrap = field.closest('.field');
            if (wrap) wrap.classList.toggle('has-error', !!msg);
        }
    }

    function clearErrors() {
        form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
        form.querySelectorAll('.field.has-error').forEach(e => e.classList.remove('has-error'));
    }

    // Contador de caracteres del mensaje
    if (messageField && msgCounter) {
        messageField.addEventListener('input', () => {
            msgCounter.textContent = messageField.value.length;
        });
    }

    function validateForm(data) {
        let valid = true;
        clearErrors();

        if (!data.name || data.name.length < 2) {
            setError('name', 'Por favor ingresa tu nombre.');
            valid = false;
        }
        if (!data.email || !isValidEmail(data.email)) {
            setError('email', 'Por favor ingresa un email válido.');
            valid = false;
        }
        if (data.phone && !/^[0-9+\s\-()]{7,15}$/.test(data.phone)) {
            setError('phone', 'Teléfono inválido (7–15 caracteres).');
            valid = false;
        }
        if (!data.message || data.message.length < 10) {
            setError('message', 'El mensaje debe tener al menos 10 caracteres.');
            valid = false;
        }
        if (!data.privacy) {
            setError('privacy', 'Debes aceptar la política de privacidad.');
            valid = false;
        }
        return valid;
    }

    function setSubmitLoading(loading) {
        submitBtn.disabled = loading;
        if (loading) {
            submitLabel.textContent = 'Enviando…';
            submitArrow.classList.add('hidden');
            submitSpinner.classList.remove('hidden');
        } else {
            submitLabel.textContent = 'Enviar mensaje';
            submitArrow.classList.remove('hidden');
            submitSpinner.classList.add('hidden');
        }
    }

    function showSuccess() {
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        formError.classList.add('hidden');
        formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showError() {
        form.classList.add('hidden');
        formError.classList.remove('hidden');
        formSuccess.classList.add('hidden');
    }

    function resetFormView() {
        form.reset();
        clearErrors();
        if (msgCounter) msgCounter.textContent = '0';
        form.classList.remove('hidden');
        formSuccess.classList.add('hidden');
        formError.classList.add('hidden');
        // Mantener bloqueo del botón si aún hay rate-limit activo
        checkRateLimitOnLoad();
    }

    resetBtn.addEventListener('click', resetFormView);
    retryBtn.addEventListener('click', () => {
        form.classList.remove('hidden');
        formError.classList.add('hidden');
    });

    /* Rate-limit: bloquear botón 60s tras envío exitoso */
    function startRateLimit() {
        const until = Date.now() + RATE_LIMIT_SECONDS * 1000;
        try { sessionStorage.setItem(RATE_LIMIT_KEY, String(until)); } catch (e) {}
        runCountdown(until);
    }

    function runCountdown(until) {
        const tick = () => {
            const remaining = Math.ceil((until - Date.now()) / 1000);
            if (remaining > 0) {
                submitBtn.disabled = true;
                submitLabel.textContent = `Espera ${remaining}s para enviar de nuevo`;
                submitArrow.classList.add('hidden');
                submitSpinner.classList.add('hidden');
                setTimeout(tick, 1000);
            } else {
                submitBtn.disabled = false;
                submitLabel.textContent = 'Enviar mensaje';
                submitArrow.classList.remove('hidden');
                try { sessionStorage.removeItem(RATE_LIMIT_KEY); } catch (e) {}
            }
        };
        tick();
    }

    function checkRateLimitOnLoad() {
        try {
            const stored = sessionStorage.getItem(RATE_LIMIT_KEY);
            if (stored) {
                const until = parseInt(stored, 10);
                if (until > Date.now()) {
                    runCountdown(until);
                } else {
                    sessionStorage.removeItem(RATE_LIMIT_KEY);
                }
            }
        } catch (e) {}
    }
    checkRateLimitOnLoad();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot: si tiene valor, es bot.
        const honeypot = form.querySelector('[name="_gotcha"]');
        if (honeypot && honeypot.value.trim() !== '') {
            console.warn('Bot detected via honeypot.');
            showSuccess(); // mostrar éxito falso para no alertar al bot
            return;
        }

        // Rate-limit sessionStorage guard
        try {
            const stored = sessionStorage.getItem(RATE_LIMIT_KEY);
            if (stored && parseInt(stored, 10) > Date.now()) {
                return;
            }
        } catch (e) {}

        const fd = new FormData(form);
        const data = {
            name: sanitizeInput(fd.get('name') || ''),
            email: sanitizeInput(fd.get('email') || ''),
            phone: sanitizeInput(fd.get('phone') || ''),
            project_type: sanitizeInput(fd.get('project_type') || ''),
            message: sanitizeInput(fd.get('message') || ''),
            privacy: form.querySelector('#privacy').checked
        };

        if (!validateForm(data)) {
            const firstError = form.querySelector('.field.has-error input, .field.has-error textarea, .field.has-error select');
            if (firstError) firstError.focus();
            return;
        }

        setSubmitLoading(true);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    project_type: data.project_type,
                    message: data.message,
                    _subject: `Nuevo contacto desde la web — ${data.name}`
                })
            });

            if (response.ok) {
                showSuccess();
                startRateLimit();
            } else {
                throw new Error('Server responded with error');
            }
        } catch (err) {
            console.error('Form submit error:', err);
            showError();
        } finally {
            setSubmitLoading(false);
        }
    });

})();
