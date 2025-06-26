// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initScrollEffects();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                submitForm(data);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldErrors(this);
            });
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const errors = {};

    // Required field validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Please enter your full name (at least 2 characters)';
        isValid = false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Please enter a message (at least 10 characters)';
        isValid = false;
    }

    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    let error = '';

    switch(field.name) {
        case 'name':
            if (!value || value.length < 2) {
                error = 'Please enter your full name (at least 2 characters)';
            }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                error = 'Please enter a valid phone number';
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                error = 'Please enter a message (at least 10 characters)';
            }
            break;
    }

    displayFieldError(field, error);
    return !error;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

// Display form errors
function displayFormErrors(errors) {
    // Clear previous errors
    clearAllErrors();
    
    Object.keys(errors).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            displayFieldError(field, errors[fieldName]);
        }
    });
}

// Display individual field error
function displayFieldError(field, error) {
    clearFieldErrors(field);
    
    if (error) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = error;
        
        field.parentNode.appendChild(errorElement);
    }
}

// Clear field errors
function clearFieldErrors(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Clear all form errors
function clearAllErrors() {
    const form = document.getElementById('contactForm');
    const errorElements = form.querySelectorAll('.field-error');
    const errorFields = form.querySelectorAll('.error');
    
    errorElements.forEach(error => error.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

// Form submission
function submitForm(data) {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    form.classList.add('form-loading');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        form.classList.remove('form-loading');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you! Your message has been sent. Omar will contact you within 24 hours.', 'success');
        
        // Clear any remaining errors
        clearAllErrors();
        
        // In a real application, you would send the data to your server:
        // fetch('/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => {
        //     if (result.success) {
        //         showNotification('Message sent successfully!', 'success');
        //         form.reset();
        //     } else {
        //         showNotification('Failed to send message. Please try again.', 'error');
        //     }
        // })
        // .catch(error => {
        //     showNotification('Network error. Please try again.', 'error');
        // })
        // .finally(() => {
        //     form.classList.remove('form-loading');
        //     submitButton.textContent = originalText;
        //     submitButton.disabled = false;
        // });
        
    }, 2000); // Simulate network delay
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll effects
function initScrollEffects() {
    // Intersection Observer for animation triggers
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.property-card, .testimonial-card, .service-card, .neighborhood-card, .market-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    // This is for future mobile menu implementation
    // Currently, the CSS hides the nav on mobile, but we can add a hamburger menu later
    
    // Add click handlers for mobile-specific interactions
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks for analytics (if needed)
            console.log('Phone number clicked:', this.href);
        });
    });

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track email clicks for analytics (if needed)
            console.log('Email clicked:', this.href);
        });
    });
}

// Property card interactions
document.addEventListener('DOMContentLoaded', function() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real application, this would open property details
            const address = this.querySelector('h3').textContent;
            showNotification(`Contact Omar for more details about ${address}`, 'info');
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });
});

// Utility functions for accessibility
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Initialize smooth scrolling behavior fallback for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    // Polyfill for smooth scrolling
    const smoothScrollPolyfill = {
        timer: null,
        
        to: function(element, duration = 500) {
            const start = window.pageYOffset;
            const target = element.getBoundingClientRect().top + start - 80;
            const startTime = performance.now();
            
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const ease = progress * (2 - progress);
                const position = start + (target - start) * ease;
                
                window.scrollTo(0, position);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            
            requestAnimationFrame(animateScroll);
        }
    };
    
    // Apply polyfill to navigation links
    document.addEventListener('DOMContentLoaded', function() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    smoothScrollPolyfill.to(target);
                }
            });
        });
    });
}