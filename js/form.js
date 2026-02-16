// Form handling for sell.html
document.addEventListener('DOMContentLoaded', function() {
    const acForm = document.getElementById('acForm');
    if (acForm) {
        acForm.addEventListener('submit', handleSubmit);
    }
    
    // Check for URL parameters (success/error)
    checkUrlParams();
    
    // Request notification permission on page load
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    
    // Get form elements
    const address = document.getElementById('addressInput')?.value.toLowerCase() || '';
    const area = document.getElementById('area')?.value || '';
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    // Reset messages
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
    
    // Validate Mumbai address
    if (!isMumbaiAddress(address, area)) {
        if (errorMessage) {
            errorMessage.textContent = 'Currently we only serve Mumbai. Please provide a Mumbai address.';
            errorMessage.style.display = 'block';
        }
        return false;
    }
    
    // Disable submit button to prevent double submission
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Add metadata
    data.submittedAt = new Date().toISOString();
    data.id = Date.now();
    data.status = 'pending';
    
    try {
        // Save to localStorage
        const savedData = saveToLocalStorage(data);
        
        // Send admin notifications
        sendAdminNotifications(savedData);
        
        // Show success message
        if (successMessage) {
            successMessage.style.display = 'block';
            event.target.reset();
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
        
        console.log('✅ Form submitted successfully:', savedData);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        if (errorMessage) {
            errorMessage.textContent = 'Something went wrong. Please try again.';
            errorMessage.style.display = 'block';
        }
        
    } finally {
        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit for Review';
        }
    }
    
    return false;
}

// Save to localStorage
function saveToLocalStorage(data) {
    const submissions = JSON.parse(localStorage.getItem('acSubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('acSubmissions', JSON.stringify(submissions));
    return data;
}

// Send admin notifications
function sendAdminNotifications(listing) {
    console.log('🔔 New listing received:', listing);
    
    // 1. Store in admin notifications
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.push({
        id: listing.id,
        title: 'New AC Listing',
        message: `${listing.fullName} from ${listing.area} listed a ${listing.brand} ${listing.acType}`,
        time: new Date().toISOString(),
        read: false,
        data: listing
    });
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    // 2. Show browser notification
    showBrowserNotification(listing);
    
    // 3. Play notification sound (optional)
    playNotificationSound();
}

// Show browser notification
function showBrowserNotification(listing) {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
        console.log('Browser notifications not supported');
        return;
    }
    
    // Check permission
    if (Notification.permission === "granted") {
        // Create notification
        const notification = new Notification("🆕 New AC Listing - Bhaarat AC Buyers", {
            body: `${listing.fullName} from ${listing.area} wants to sell ${listing.brand} ${listing.acType} (${listing.capacity} Ton)`,
            icon: window.location.origin + '/assets/images/logo.png',
            badge: window.location.origin + '/assets/images/logo.png',
            tag: `listing-${listing.id}`,
            requireInteraction: true,
            silent: false,
            vibrate: [200, 100, 200]
        });
        
        // Handle notification click
        notification.onclick = function() {
            window.focus();
            // You can open admin panel here
            const wantToView = confirm('View this listing in admin panel?');
            if (wantToView) {
                // Store current listing ID for admin panel
                localStorage.setItem('currentListing', JSON.stringify(listing));
                window.open('admin.html', '_blank');
            }
            notification.close();
        };
        
        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
        
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

// Play notification sound (optional)
function playNotificationSound() {
    try {
        const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
        console.log('Sound not supported');
    }
}

// Check if address is in Mumbai
function isMumbaiAddress(address, area) {
    if (!address) return false;
    
    const mumbaiKeywords = [
        'mumbai', 'thane', 'navi mumbai', 'andheri', 'bandra', 'borivali', 
        'dadar', 'powai', 'vashi', 'worli', 'goregaon', 'malad', 'juhu',
        'chembur', 'ghatkopar', 'mulund', 'kandivali', 'santacruz', 'khar',
        'marine lines', 'churchgate', 'colaba', 'lower parel', 'prabhadevi',
        'dadar', 'matunga', 'sion', 'wadala', 'kings circle', 'byculla'
    ];
    
    const addressLower = address.toLowerCase();
    
    for (const keyword of mumbaiKeywords) {
        if (addressLower.includes(keyword)) return true;
    }
    
    return area && area !== '';
}

// Check URL parameters for messages
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
    if (success === '1') {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Debug functions - type in browser console:
// debugForm.getAll() - to see all submissions
// debugForm.clearAll() - to clear all data
window.debugForm = {
    getAll: function() {
        return {
            submissions: JSON.parse(localStorage.getItem('acSubmissions') || '[]'),
            notifications: JSON.parse(localStorage.getItem('adminNotifications') || '[]')
        };
    },
    getLatest: function() {
        const submissions = JSON.parse(localStorage.getItem('acSubmissions') || '[]');
        return submissions[submissions.length - 1] || null;
    },
    clearAll: function() {
        if (confirm('Delete all form data?')) {
            localStorage.removeItem('acSubmissions');
            localStorage.removeItem('adminNotifications');
            console.log('✅ All data cleared');
        }
    },
    testNotification: function() {
        const testData = {
            id: Date.now(),
            fullName: 'Test User',
            area: 'Andheri',
            brand: 'LG',
            acType: 'Split',
            capacity: '1.5'
        };
        showBrowserNotification(testData);
    }
};

// Log that forms.js is loaded
console.log('✅ forms.js loaded successfully');