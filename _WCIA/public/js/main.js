// ============================================================
// HAMBURGER TOGGLE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mainNav.classList.toggle('open');
        });
        // Close nav on link click (mobile)
        document.querySelectorAll('.main-nav ul li a').forEach(link => {
            link.addEventListener('click', function(e) {
                const dropdown = this.nextElementSibling;
                if (dropdown && dropdown.classList.contains('dropdown')) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('open');
                    }
                } else {
                    if (window.innerWidth <= 768) {
                        hamburger.classList.remove('active');
                        mainNav.classList.remove('open');
                    }
                }
            });
        });
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const header = document.getElementById('mainHeader');
                if (header && !header.contains(e.target)) {
                    hamburger.classList.remove('active');
                    mainNav.classList.remove('open');
                }
            }
        });
    }

    // ============================================================
    // SCROLL REVEAL
    // ============================================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ============================================================
    // STICKY HEADER SHADOW
    // ============================================================
    const header = document.getElementById('mainHeader');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 80) {
                header.style.boxShadow = '0 4px 40px rgba(0,0,0,0.6)';
            } else {
                header.style.boxShadow = 'none';
            }
            lastScroll = currentScroll;
        });
    }

    // ============================================================
    // ACTIVE NAV LINK HIGHLIGHT
    // ============================================================
    const currentPath = window.location.pathname;
    document.querySelectorAll('.main-nav ul li a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
            link.classList.add('active');
        }
    });

    // ============================================================
    // FORM HANDLING (Contact / Donate)
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('Your message has been sent successfully!');
                    this.reset();
                } else {
                    alert('Failed to send message. Please try again.');
                }
            } catch (err) {
                alert('Server error. Please try later.');
            }
        });
    }

    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
        donateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            try {
                const response = await fetch('/api/donate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('Thank you for your donation intention! We will contact you shortly.');
                    this.reset();
                } else {
                    alert('Failed to process donation. Please try again.');
                }
            } catch (err) {
                alert('Server error. Please try later.');
            }
        });
    }
});