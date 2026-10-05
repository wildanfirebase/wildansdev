document.addEventListener('DOMContentLoaded', () => {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    const isDesktop = () => window.innerWidth >= 1024;

    // ==========================================
    // 1. SCROLL PROGRESS BAR
    // ==========================================
    const progressBar = document.getElementById('scroll-progress');
    let progressTicking = false;

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = percent + '%';
        progressTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!progressTicking) {
            window.requestAnimationFrame(updateProgress);
            progressTicking = true;
        }
    }, { passive: true });
    updateProgress();

    // ==========================================
    // 2. NAVBAR SCROLL
    // ==========================================
    const navbar = document.getElementById('navbar');

    const onNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    // ==========================================
    // 3. MOBILE MENU
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    const openMenu = () => {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900 && navMenu.classList.contains('active')) closeMenu();
    });

    // ==========================================
    // 4. ACTIVE LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const linkItems = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollY = window.scrollY + 130;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                linkItems.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ==========================================
    // 5. TYPING EFFECT
    // ==========================================
    const typingText = document.getElementById('typing-text');
    const roles = [
        "RPL Student",
        "Web Developer",
        "Graphic Designer",
        "UI/UX Enthusiast",
        "Creative Technologist"
    ];

    if (typingText && !prefersReduced) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentRole = roles[roleIndex];
            let speed;

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                speed = 50;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                speed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                speed = 1800;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }

            setTimeout(type, speed);
        };

        setTimeout(type, 900);
    } else if (typingText) {
        typingText.textContent = "RPL Student";
    }

    // ==========================================
    // 6. SCROLL REVEAL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // ==========================================
    // 7. HERO INTRO STAGGER
    // ==========================================
    const heroReveals = document.querySelectorAll('.hero .reveal');

    if (!prefersReduced) {
        heroReveals.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, 150 + index * 120);
        });
    } else {
        heroReveals.forEach(el => el.classList.add('active'));
    }

    // ==========================================
    // 8. SECTION CARD STAGGER
    // ==========================================
    const staggerObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.skill-card, .project-card, .info-card, .timeline-item');
                cards.forEach((card, i) => {
                    card.style.transitionDelay = `${i * 0.08}s`;
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.skills-grid, .projects-grid, .about-cards, .timeline').forEach(grid => {
        staggerObserver.observe(grid);
    });

    // ==========================================
    // 9. PARTICLES
    // ==========================================
    const particlesContainer = document.getElementById('particles');

    const buildParticles = () => {
        if (!particlesContainer) return;
        particlesContainer.innerHTML = '';
        if (prefersReduced) return;

        const count = window.innerWidth < 600 ? 6 : (window.innerWidth < 900 ? 10 : 15);

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.style.position = 'absolute';
            const size = Math.random() * 3 + 1.5;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.background = 'rgba(139, 92, 246, 0.45)';
            p.style.borderRadius = '50%';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            const dur = Math.random() * 8 + 8;
            const delay = Math.random() * 4;
            const drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
            p.style.animation = `floatParticle ${dur}s linear ${delay}s infinite`;
            p.style.setProperty('--drift', drift);
            p.style.pointerEvents = 'none';
            particlesContainer.appendChild(p);
        }
    };

    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes floatParticle {
                0%   { transform: translate3d(0, 0, 0); opacity: 0; }
                10%  { opacity: 1; }
                90%  { opacity: 1; }
                100% { transform: translate3d(var(--drift, 0), -120px, 0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    buildParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(buildParticles, 300);
    });

    // ==========================================
    // 10. CUSTOM CURSOR (Desktop only)
    // ==========================================
    if (!isTouch && !prefersReduced && isDesktop()) {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        const label = document.getElementById('cursor-label');
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.body.classList.add('has-cursor');

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (dot) {
                dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
        });

        const renderRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            if (ring) {
                ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }
            requestAnimationFrame(renderRing);
        };
        renderRing();

        // Hover targets
        const setHover = (state, text = '') => {
            if (!ring) return;
            ring.classList.remove('hovering', 'viewing');
            if (state === 'hover') ring.classList.add('hovering');
            if (state === 'view') ring.classList.add('viewing');
            if (label) label.textContent = text;
        };

        document.querySelectorAll('[data-cursor="hover"], a, button').forEach(el => {
            el.addEventListener('mouseenter', () => setHover('hover'));
            el.addEventListener('mouseleave', () => setHover(''));
        });

        document.querySelectorAll('[data-cursor="view"]').forEach(el => {
            el.addEventListener('mouseenter', () => setHover('view', 'VIEW'));
            el.addEventListener('mouseleave', () => setHover(''));
        });

        // Hide on leave window
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('has-cursor');
        });
        document.addEventListener('mouseenter', () => {
            document.body.classList.add('has-cursor');
        });
    }

    // ==========================================
    // 11. PARALLAX (Desktop only)
    // ==========================================
    if (isDesktop() && !prefersReduced) {
        const heroImage = document.querySelector('.hero-image');
        const floatingCard = document.querySelector('.floating-card');
        let px = 0, py = 0, ticking = false;

        document.addEventListener('mousemove', (e) => {
            px = (window.innerWidth - e.pageX) / 60;
            py = (window.innerHeight - e.pageY) / 60;
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (heroImage) heroImage.style.transform = `translate3d(${px}px, ${py}px, 0)`;
                    if (floatingCard) floatingCard.style.transform = `translate3d(${-px * 1.4}px, ${-py * 1.4}px, 0)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ==========================================
    // 12. TILT 3D (Desktop only)
    // ==========================================
    if (isDesktop() && !prefersReduced && !isTouch) {
        const tiltCards = document.querySelectorAll('.tilt');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotX = ((y - cy) / cy) * -5;
                const rotY = ((x - cx) / cx) * 5;
                card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ==========================================
    // 13. NUMBER COUNTER
    // ==========================================
    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 30));

                const tick = () => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target;
                    } else {
                        el.textContent = current;
                        setTimeout(tick, 40);
                    }
                };
                tick();
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));

    // ==========================================
    // 14. BACK TO TOP
    // ==========================================
    const backBtn = document.getElementById('back-to-top');

    const onBackScroll = () => {
        if (window.scrollY > 500) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', onBackScroll, { passive: true });
    onBackScroll();

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        });
    }

    // ==========================================
    // 15. SMOOTH SCROLL FOR INTERNAL ANCHORS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: top,
                    behavior: prefersReduced ? 'auto' : 'smooth'
                });
            }
        });
    });

});