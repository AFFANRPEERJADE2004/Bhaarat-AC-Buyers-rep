// Header and Footer Components
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    setActiveNavLink();
});

function loadHeader() {
    const headerHTML = `
        <header>
            <nav>
                <a href="index.html" class="logo">
                    <img src="assets/images/logo.png" alt="Bhaarat AC Buyers" class="logo-img">
                    <span class="logo-text">Bhaarat AC Buyers</span>
                </a>
                <button class="mobile-menu-btn" onclick="toggleMenu()">☰</button>
                <ul class="nav-links" id="navLinks">
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li><a href="sell.html" class="nav-link">Sell Your AC</a></li>
                    <li><a href="about.html" class="nav-link">About Us</a></li>
                    <li><a href="contact.html" class="nav-link">Contact</a></li>
                </ul>
            </nav>
        </header>
    `;
    
    document.getElementById('header').innerHTML = headerHTML;
}

function loadFooter() {
    const footerHTML = `
        <footer>
            <div class="footer-content">
                <div class="footer-links">
                    <a href="index.html">Home</a>
                    <a href="sell.html">Sell Your AC</a>
                    <a href="about.html">About Us</a>
                    <a href="contact.html">Contact</a>
                </div>
                <!-- Business Details Card -->
            <div style="
                max-width:900px;
                margin:40px auto;
                background:#f4f4f4;
                padding:25px;
                border-radius:14px;
                box-shadow:0 10px 25px rgba(0,0,0,0.15);
                font-family:Arial, sans-serif;
                color:#333;
            ">

                <h3 style="
                    font-size:20px;
                    font-weight:600;
                    margin-bottom:10px;
                    border-bottom:3px solid #1e73be;
                    padding-bottom:6px;
                ">
                    Registered Address
                </h3>

                <p style="line-height:1.7; font-size:15px; margin-bottom:25px;">
                    Shop No 36, DN NAGAR MUNCIPAL,<br>
                    SCHOOL RD OPPOSITE BHARAT SKYVIDTAS BUILDING,<br>
                    SONAL CO OPERATIVE HSG SOCIETY,<br>
                    INDIRA NAGAR, DN NAGAR ANDHERI WEST, Mumbai,<br>
                    Mumbai City, Maharashtra – 400053
                </p>

                <h3 style="
                    font-size:20px;
                    font-weight:600;
                    margin-bottom:10px;
                    border-bottom:3px solid #1e73be;
                    padding-bottom:6px;
                ">
                    Business Registration
                </h3>

                <p style="margin:8px 0; font-size:15px;">
                    <strong>Udyam Registration Number:</strong> UDYAM-MH-18-0505135
                </p>
                 
                <p style="margin:8px 0; font-size:15px;">
                    <strong>Business Name:</strong> Bhaarat AC Buyers
                </p>

                <p style="margin:8px 0; font-size:15px;">
                    <strong>Service:</strong> Old and Scrap AC Buyer and Seller
                </p>
 
                <p style="margin:8px 0; font-size:15px;">
                    <strong>Ownership:</strong> MR. Mohammad Jameel Akhtar Khan
                </p>

            </div>
                <p style="margin-top: 1rem; opacity: 0.8;">&copy; 2026 Bhaarat AC Buyers. All rights reserved.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.7;">Professional AC buying service in Mumbai | Best prices guaranteed</p>
            </div>
        </footer>
    `;
    
    document.getElementById('footer').innerHTML = footerHTML;
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navLinks && menuBtn && !navLinks.contains(event.target) && !menuBtn.contains(event.target)) {
        navLinks.classList.remove('active');
    }
});
