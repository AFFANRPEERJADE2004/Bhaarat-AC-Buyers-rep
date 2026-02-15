// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bhaarat AC Buyers website loaded');
    
    // Track page views (for analytics)
    trackPageView();
    
    // Initialize any third-party integrations
    initWhatsAppIntegration();
    initPhoneTracking();
});

function trackPageView() {
    const pageName = window.location.pathname.split('/').pop() || 'home';
    console.log(`Page viewed: ${pageName}`);
    
    // You can integrate Google Analytics here
    /*
    gtag('config', 'GA_MEASUREMENT_ID', {
        'page_title': pageName,
        'page_path': window.location.pathname
    });
    */
}

function initWhatsAppIntegration() {
    // Pre-fill WhatsApp messages based on page
    const whatsappLinks = document.querySelectorAll('.whatsapp-btn');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    whatsappLinks.forEach(link => {
        let message = 'Hi, I want to sell my old AC';
        
        if (currentPage.includes('sell')) {
            message = 'Hi, I have an AC to sell. Can you help?';
        } else if (currentPage.includes('contact')) {
            message = 'Hi, I have a question about selling my AC';
        }
        
        const encodedMessage = encodeURIComponent(message);
        const baseUrl = link.href.split('?')[0];
        link.href = `${baseUrl}?text=${encodedMessage}`;
    });
}

function initPhoneTracking() {
    // Track phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone call clicked');
            // Track in analytics
            /*
            gtag('event', 'phone_call_click', {
                'page': window.location.pathname
            });
            */
        });
    });
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Handle offline/online status
window.addEventListener('online', function() {
    document.body.classList.remove('offline');
    console.log('Back online');
});

window.addEventListener('offline', function() {
    document.body.classList.add('offline');
    console.log('You are offline');
});