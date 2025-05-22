// Mobile Menu Toggle
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = mobileMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenu.setAttribute('aria-hidden', !isExpanded);
        
        // Prevent scrolling when the mobile menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        toggleMenu();
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed headers
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation
function validateForm(form) {
    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const phone = form.querySelector('#phone')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();
    let isValid = true;
    
    // Reset previous error messages
    form.querySelectorAll('.error-message').forEach(el => el.remove());

    // Validate name
    if (!name) {
        showError(form.querySelector('#name'), 'Please enter your name');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError(form.querySelector('#email'), 'Please enter your email');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(form.querySelector('#email'), 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!phone) {
        showError(form.querySelector('#phone'), 'Please enter your phone number');
        isValid = false;
    }
    
    // Validate message
    if (!message) {
        showError(form.querySelector('#message'), 'Please enter your message');
        isValid = false;
    }

    return isValid;
}

// Show error message
function showError(input, message) {
    if (!input) return;
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = 'var(--error)';
    
    // Remove error styling on input
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        const errorMsg = this.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
}

// Add form validation to all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        if (!validateForm(this)) {
            e.preventDefault(); // Prevent form submission if validation fails
        }
    });
});

// Email Validation Function
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Fetch Testimonials Dynamically
async function fetchTestimonials() {
    try {
        const response = await fetch('testimonials.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const testimonialsContainer = document.getElementById('testimonials');
        if (testimonialsContainer) {
            data.forEach(testimonial => {
                const testimonialHTML = `
                    <div class="testimonial animate-on-scroll">
                        <p class="text-gray-600">${testimonial.text}</p>
                        <p class="text-primary font-bold mt-4">${testimonial.author}</p>
                    </div>
                `;
                testimonialsContainer.insertAdjacentHTML('beforeend', testimonialHTML);
            });

            // Reapply scroll animations after loading testimonials
            applyScrollAnimations();
        }
    } catch (error) {
        console.error('Error fetching testimonials:', error);
    }
}

// Initialize testimonials if on the testimonials page
if (document.getElementById('testimonials')) {
    fetchTestimonials();
}

// Scroll Animation Observer
const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                scrollObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' } // Trigger when 10% of the element is visible
);

// Apply Scroll Animations to Elements
function applyScrollAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        scrollObserver.observe(element);
    });
}

// Lazy Load Images
document.addEventListener("DOMContentLoaded", () => {
    // Apply animations to elements with animate-on-scroll class
    applyScrollAnimations();
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyLoadObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src; // Set the actual image source
                    img.onload = () => img.classList.add('loaded'); // Add a class when the image is fully loaded
                    observer.unobserve(img); // Stop observing after loading
                }
            });
        },
        { rootMargin: '50px 0px' } // Start loading images slightly before they enter the viewport
    );

    lazyImages.forEach(img => lazyLoadObserver.observe(img));
    
    // Add active class to current page in navigation
    highlightCurrentPage();
});

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Add CSS class for active navigation links
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
});

// Accessibility Enhancements
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click(); // Trigger click on Enter or Space key press for accessibility
        }
    });
});

// Back to top button functionality
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add appointment booking functionality
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="bg-success text-white p-4 rounded mb-4">
                    <h3 class="font-bold mb-2">Appointment Request Received!</h3>
                    <p>Thank you for scheduling with us. We'll contact you shortly to confirm your appointment.</p>
                </div>
            `;
            
            this.parentNode.insertBefore(successMessage, this);
            this.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    });
}
