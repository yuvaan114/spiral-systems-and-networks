/* ============================================
   SPIRAL Systems & Networks - JavaScript
   Dynamic Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (currentScroll > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== MOBILE NAV TOGGLE ==========
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ========== ACTIVE NAV LINK ON SCROLL ==========
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ========== SCROLL-TRIGGERED ANIMATIONS ==========
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    animateElements.forEach(el => {
        animationObserver.observe(el);
    });

    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let counterAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);

                counter.textContent = formatNumber(current);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = formatNumber(target);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('en-IN');
        }
        return num.toString();
    }

    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== CONTACT FORM HANDLING ==========
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Validate
            if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate submission
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                submitBtn.style.background = '#10b981';
                showNotification('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.', 'success');

                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '24px',
            maxWidth: '420px',
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            zIndex: '10001',
            animation: 'slideInRight 0.4s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9rem',
        });

        if (type === 'success') {
            notification.style.background = '#ecfdf5';
            notification.style.border = '1px solid #a7f3d0';
            notification.style.color = '#065f46';
        } else if (type === 'error') {
            notification.style.background = '#fef2f2';
            notification.style.border = '1px solid #fecaca';
            notification.style.color = '#991b1b';
        }

        const contentDiv = notification.querySelector('.notification-content');
        Object.assign(contentDiv.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        });

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'inherit',
            opacity: '0.6',
            fontSize: '1rem',
        });

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease forwards';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }

    // Add notification animations to stylesheet
    const notifStyle = document.createElement('style');
    notifStyle.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(notifStyle);

    // ========== PARALLAX EFFECT ON HERO IMAGE ==========
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (heroImage && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.15;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }

    // ========== TILT EFFECT ON PRODUCT CARDS ==========
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========== TYPED TEXT EFFECT FOR HERO (subtle) ==========
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    // ========== MAGNETIC BUTTON EFFECT ==========
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ========== LAZY LOADING IMAGES ==========
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';

                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                }

                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ========== CURSOR GLOW EFFECT ON HERO ==========
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && window.innerWidth > 1024) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            heroSection.style.setProperty('--cursor-x', `${x}px`);
            heroSection.style.setProperty('--cursor-y', `${y}px`);
        });

        const cursorGlowStyle = document.createElement('style');
        cursorGlowStyle.textContent = `
            .hero-section::after {
                content: '';
                position: fixed;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(200, 16, 46, 0.06) 0%, transparent 70%);
                pointer-events: none;
                left: var(--cursor-x, 50%);
                top: var(--cursor-y, 50%);
                transform: translate(-50%, -50%);
                z-index: 0;
            }
        `;
        document.head.appendChild(cursorGlowStyle);
    }

    console.log('✅ SPIRAL Systems & Networks - Website loaded successfully');
});
