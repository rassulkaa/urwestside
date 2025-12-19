document.addEventListener('DOMContentLoaded', () => {
    // Scroll Header Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation
    const hamburger = document.querySelector('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });


    /* Particle System */
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    let particlesArray;

    // Use devicePixelRatio for sharp rendering on retina displays
    const dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        // Scale context to match
        ctx.scale(dpr, dpr);
        // Logic dimensions for calculations
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 0.5; // Small, elegant size
            this.speedX = Math.random() * 0.5 - 0.25; // Gentle horizontal drift
            this.speedY = Math.random() * -0.5 - 0.2; // Gentle upward float
            this.color = `rgba(210, 161, 94, ${Math.random() * 0.5 + 0.2})`; // Gold color #d2a15e
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Reset if out of bounds
            if (this.x < 0 || this.x > window.innerWidth || this.y < 0) {
                this.x = Math.random() * window.innerWidth;
                this.y = window.innerHeight + 10;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (window.innerWidth * window.innerHeight) / 15000; // Density
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr); // Clear logic dimensions
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);

    // Init
    resizeCanvas();
    animateParticles();
    // Intersection Observer for Fade-up Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation class to cards and gallery items
    const animatedElements = document.querySelectorAll('.card, .gallery-item, .section-header');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-scroll');
        observer.observe(el);
    });
});

// Add extra CSS for the js-triggered animations if needed, 
// though we reused some classes, let's ensure 'fade-in-scroll' works
const style = document.createElement('style');
style.textContent = `
    .fade-in-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .fade-in-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Time Portal Comparison Slider
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.comparison-container');
    const historicImg = document.querySelector('.image-wrapper.historic');
    const handle = document.querySelector('.slider-handle');

    if (container && historicImg && handle) {
        let isDragging = false;

        const getPositionX = (event) => {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].pageX;
        };

        const updateSlider = (x) => {
            const rect = container.getBoundingClientRect();
            let position = x - rect.left;

            // Clamp values
            if (position < 0) position = 0;
            if (position > rect.width) position = rect.width;

            const percentage = (position / rect.width) * 100;

            historicImg.style.width = `${percentage}%`;
            handle.style.left = `${percentage}%`;
        };

        const startDrag = (e) => {
            isDragging = true;
            updateSlider(getPositionX(e));
        };

        const stopDrag = () => {
            isDragging = false;
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            // Prevent scrolling on mobile while sliding
            // e.preventDefault(); 
            updateSlider(getPositionX(e));
        };

        // Mouse Events
        container.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mousemove', moveDrag);

        // Touch Events
        container.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchmove', moveDrag, { passive: true });

        // Click to move
        container.addEventListener('click', (e) => {
            updateSlider(getPositionX(e));
        });
    }
});
