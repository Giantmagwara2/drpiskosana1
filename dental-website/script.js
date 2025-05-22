// Enhanced JavaScript with modern UI/UX interactions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            mobileMenu.classList.toggle('active');
            mobileMenu.setAttribute('aria-hidden', expanded);
            
            // Prevent body scrolling when menu is open
            document.body.style.overflow = expanded ? '' : 'hidden';
        });
    }
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.remove('active');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
                
                // Scroll to target
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll Animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Material Design Form Behavior
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Add active class if input has value
        if (input.value) {
            input.parentElement.classList.add('active');
        }
        
        // Add focus event
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('active', 'focused');
        });
        
        // Add blur event
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (!this.value) {
                this.parentElement.classList.remove('active');
            }
        });
        
        // Add input event for validation
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.parentElement.classList.remove('invalid');
                this.parentElement.classList.add('valid');
            } else {
                this.parentElement.classList.remove('valid');
                if (this.value) {
                    this.parentElement.classList.add('invalid');
                } else {
                    this.parentElement.classList.remove('invalid');
                }
            }
        });
    });
    
    // Form Validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formInputs = this.querySelectorAll('.form-control[required]');
            
            formInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.parentElement.classList.add('invalid');
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message
                const formSuccess = document.createElement('div');
                formSuccess.className = 'form-success';
                formSuccess.innerHTML = `
                    <div class="form-success-icon">
                        <i class="material-icons">check_circle</i>
                    </div>
                    <div class="form-success-message">
                        <h3>Message Sent!</h3>
                        <p>Thank you for contacting us. We'll get back to you shortly.</p>
                    </div>
                `;
                
                // Replace form with success message
                contactForm.parentElement.appendChild(formSuccess);
                contactForm.style.display = 'none';
                
                // Reset form
                contactForm.reset();
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle current question
            this.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.textContent = isExpanded ? 'expand_more' : 'expand_less';
            }
        });
    });
    
    // Ripple Effect for Buttons
    const buttons = document.querySelectorAll('.btn, .social-button, .contact-card-action, .floating-action-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Accessibility Improvements
    // Add aria-label to links with only icons
    document.querySelectorAll('a:not([aria-label])').forEach(link => {
        if (!link.textContent.trim() && link.querySelector('i')) {
            const iconText = link.querySelector('i').className.split(' ')
                .find(cls => cls.startsWith('fa-'))
                ?.replace('fa-', '')
                || 'Link';
            
            link.setAttribute('aria-label', iconText);
        }
    });
    
    // Add keyboard navigation for custom components
    const customInteractives = document.querySelectorAll('.contact-card, .social-button, .floating-action-btn');
    
    customInteractives.forEach(element => {
        if (!element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Newsletter Form Validation
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const consentCheckbox = this.querySelector('input[type="checkbox"]');
            
            let isValid = true;
            
            if (!emailInput.checkValidity()) {
                emailInput.classList.add('invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('invalid');
            }
            
            if (!consentCheckbox.checked) {
                consentCheckbox.classList.add('invalid');
                isValid = false;
            } else {
                consentCheckbox.classList.remove('invalid');
            }
            
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'newsletter-success';
                successMessage.innerHTML = `
                    <i class="material-icons">check_circle</i>
                    <p>Thank you for subscribing to our newsletter!</p>
                `;
                
                // Replace form with success message
                newsletterForm.parentElement.appendChild(successMessage);
                newsletterForm.style.display = 'none';
                
                // Reset form
                newsletterForm.reset();
            }
        });
    }
    
    // Lazy Loading for Images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading') && !img.classList.contains('no-lazy')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img:not(.no-lazy)');
        
        function lazyLoad() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top <= window.innerHeight + 300) {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                }
            });
        }
        
        // Initial check
        lazyLoad();
        
        // Check on scroll
        window.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
    }
    
    // Preload hover state images
    const preloadLinks = document.querySelectorAll('a');
    
    preloadLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const backgroundImage = window.getComputedStyle(this).getPropertyValue('background-image');
            
            if (backgroundImage && backgroundImage !== 'none' && backgroundImage.includes('url')) {
                const imageUrl = backgroundImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
                const img = new Image();
                img.src = imageUrl;
            }
        });
    });
});
