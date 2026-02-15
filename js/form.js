// Form handling for sell.html
document.addEventListener('DOMContentLoaded', function() {
    const acForm = document.getElementById('acForm');
    if (acForm) {
        acForm.addEventListener('submit', handleSubmit);
    }
});

function handleSubmit(event) {
    event.preventDefault();
    
    const address = document.getElementById('addressInput')?.value.toLowerCase() || '';
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Reset messages
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
    
    // Validate Mumbai address
    if (!address.includes('mumbai') && !address.includes('thane') && !address.includes('navi mumbai')) {
        if (errorMessage) {
            errorMessage.textContent = 'Currently we only serve Mumbai. Please provide a Mumbai address.';
            errorMessage.style.display = 'block';
        }
        return false;
    }
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Add timestamp
    data.submittedAt = new Date().toISOString();
    data.id = Date.now();
    
    // Save to localStorage
    saveSubmission(data);
    
    // Show success message
    if (successMessage) {
        successMessage.style.display = 'block';
        event.target.reset();
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Optional: Send to email/backend
    sendToBackend(data);
    
    return false;
}

function saveSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('acSubmissions') || '[]');
    submissions.push(data);
    localStorage.setItem('acSubmissions', JSON.stringify(submissions));
}

function sendToBackend(data) {
    // You can implement AJAX call to your backend here
    console.log('Form submitted:', data);
    
    // Example fetch to your backend
    /*
    fetch('https://your-backend.com/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
    */
}

// Form validation helper
function validateForm(formData) {
    const errors = [];
    
    if (!formData.fullName || formData.fullName.length < 3) {
        errors.push('Please enter a valid name');
    }
    
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
        errors.push('Please enter a valid 10-digit mobile number');
    }
    
    return errors;
}