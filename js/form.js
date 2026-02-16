// 🔹 Add your Supabase credentials
const SUPABASE_URL = "https://evjomzdvlsdstgkiezuw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2am9temR2bHNkc3Rna2llenV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNjUyMDksImV4cCI6MjA4Njc0MTIwOX0.r1ciKUfRgyuJavwmBgue2fB_QEZ5UpUnAtgnt07IzeQ";

const { createClient } = window.supabase;

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
// Form handling for sell.html
document.addEventListener('DOMContentLoaded', function() {
    const acForm = document.getElementById('acForm');
    if (acForm) {
        acForm.addEventListener('submit', handleSubmit);
    }
    
    // Check for URL parameters (success/error)
    checkUrlParams();
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
    const data = {
    full_name: formData.get("fullName"),
    mobile: formData.get("mobile"),
    address: formData.get("address"),
    area: formData.get("area"),
    brand: formData.get("brand"),
    ac_type: formData.get("acType"),
    capacity: formData.get("capacity"),
    age: formData.get("age"),
    ac_condition: formData.get("condition"),
    notes: formData.get("notes") || null,
    status: "pending"
    };
    formData.forEach((value, key) => {
        // Convert form field names to database column names
        if (key === 'fullName') data.full_name = value;
        else if (key === 'acType') data.ac_type = value;
        else if (key === 'condition') data.ac_condition = value;
        else data[key] = value;
    });
    
    // Add metadata
    data.status = 'pending';
    
    try {
        // Save directly to Supabase
        const { error } = await supabaseClient
            .from('ac_listings')
            .insert([data]);

        if (error) {
            console.error('supabaseClient error:', error);
            throw error;
        }

        console.log('✅ Data saved to supabaseClient');
        
        // Show success message with the confirmation text
        if (successMessage) {
            successMessage.innerHTML = `
                <strong>Thank you!</strong><br>
                Our team will contact you shortly to discuss the best possible price.
            `;
            successMessage.style.display = 'block';
            event.target.reset();
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
        
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

// Check if address is in Mumbai
function isMumbaiAddress(address, area) {
    if (!address) return false;
    
    const mumbaiKeywords = [
        'mumbai', 'thane', 'navi mumbai', 'andheri', 'bandra', 'borivali', 
        'dadar', 'powai', 'vashi', 'worli', 'goregaon', 'malad', 'juhu',
        'chembur', 'ghatkopar', 'mulund', 'kandivali', 'santacruz', 'khar',
        'marine lines', 'churchgate', 'colaba', 'lower parel', 'prabhadevi',
        'matunga', 'sion', 'wadala', 'kings circle', 'byculla'
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
            successMessage.innerHTML = `
                <strong>Thank you!</strong><br>
                Our team will contact you shortly to discuss the best possible price.
            `;
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Simple debug function
window.debugForm = {
    testConnection: async function() {
        try {
            const { data, error } = await supabaseClient
                .from('ac_listings')
                .select('count', { count: 'exact', head: true });
            
            if (error) {
                console.log('❌ supabaseClient connection failed:', error);
            } else {
                console.log('✅ supabaseClient connected successfully!');
            }
        } catch (e) {
            console.log('❌ supabaseClient error:', e);
        }
    }
};

console.log('✅ forms.js loaded - supabaseClient only');
