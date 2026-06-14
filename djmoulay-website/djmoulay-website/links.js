/* ==========================================================================
   MULTILINGUAL TRANSLATION SYSTEM
   ========================================================================== */
let currentLanguage = localStorage.getItem('djmoulay_lang') || 'fr';

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('djmoulay_lang', lang);
    
    // Toggle active buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`lang-btn-${lang}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Update text direction and HTML attributes
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
        document.body.classList.add('rtl-layout');
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'fr';
        document.body.classList.remove('rtl-layout');
    }
    
    // Update text content for elements with data-fr and data-ar
    document.querySelectorAll('[data-fr]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            el.innerHTML = text;
        }
    });

    // Update WhatsApp links based on language
    updateWhatsAppLink();
}

// WhatsApp Booking text synchronization
const WHATSAPP_NUMBER = "213550324525"; // Replace with DJ Moulay's real WhatsApp number
function updateWhatsAppLink() {
    const waLink = document.getElementById('wa-booking-link');
    if (!waLink) return;
    
    let text = "";
    if (currentLanguage === 'ar') {
        text = encodeURIComponent("مرحباً دي جي مولاي، أرغب في حجز خدماتكم لإحياء حفلي. يرجى تزويدي بالتفاصيل.");
    } else {
        text = encodeURIComponent("Bonjour DJ Moulay, je souhaite réserver vos services pour mon événement. Merci de me recontacter.");
    }
    
    waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Initial language setup on load
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage(currentLanguage);
    updateWhatsAppLink();
    initQRCodeGenerator();
    initMiniAudio();
});

/* ==========================================================================
   PREMIUM QR CODE COMPOSITER & DOWNLOADER
   ========================================================================== */
const qrModal = document.getElementById('qr-modal');
const rawQrContainer = document.getElementById('qrcode-raw');
const compositeCanvas = document.getElementById('qr-composite-canvas');
const compositeCtx = compositeCanvas.getContext('2d');

function toggleQRModal() {
    qrModal.classList.toggle('open');
    if (qrModal.classList.contains('open')) {
        // Regenerate or draw just in case
        drawCompositeQR();
    }
}

function initQRCodeGenerator() {
    // Determine target URL: fallback to website if local environment
    let targetUrl = window.location.href;
    if (targetUrl.startsWith('file:') || targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
        // Fallback to high-end online domain
        targetUrl = 'https://djmoulay.com/links.html';
    }

    // Generate standard high-density QR Code in hidden container
    new QRCode(rawQrContainer, {
        text: targetUrl,
        width: 512,
        height: 512,
        colorDark: "#060608", // match dark theme
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H // High correction level to allow logo overlap
    });
}

function drawCompositeQR() {
    // Set high resolution for downloading crisp prints
    compositeCanvas.width = 800;
    compositeCanvas.height = 800;

    // Wait for the library to draw the raw image
    const checkRawQrInterval = setInterval(() => {
        const rawQrImg = rawQrContainer.querySelector('img');
        if (rawQrImg && rawQrImg.complete) {
            clearInterval(checkRawQrInterval);
            
            // Draw the QR Code image on composite canvas
            compositeCtx.drawImage(rawQrImg, 0, 0, 800, 800);
            
            // Load and overlay the center Logo
            const logo = new Image();
            logo.src = 'assets/logo.png';
            logo.onload = () => {
                const logoSize = 180; // Size of the center logo card
                const center = (800 - logoSize) / 2;
                
                // Draw a styled solid background container for the logo
                compositeCtx.fillStyle = '#060608';
                compositeCtx.shadowColor = 'rgba(212, 175, 55, 0.4)';
                compositeCtx.shadowBlur = 20;
                
                // Rounded corner container
                const radius = 24;
                compositeCtx.beginPath();
                compositeCtx.roundRect(center, center, logoSize, logoSize, radius);
                compositeCtx.fill();
                
                // Draw logo with gold border
                compositeCtx.strokeStyle = '#d4af37';
                compositeCtx.lineWidth = 6;
                compositeCtx.stroke();
                
                // Draw logo image inside the container
                compositeCtx.shadowBlur = 0; // reset shadow
                const innerPadding = 25;
                compositeCtx.drawImage(
                    logo, 
                    center + innerPadding, 
                    center + innerPadding, 
                    logoSize - (innerPadding * 2), 
                    logoSize - (innerPadding * 2)
                );
            };
        }
    }, 100);
}

// Download function
function downloadQRCode() {
    // Generate data URL from the composite canvas
    const dataUrl = compositeCanvas.toDataURL('image/png');
    
    // Create temporary download link
    const link = document.createElement('a');
    link.download = 'DJ_MOULAY_QR_CODE_PREMIUM.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================================================
   MINI FLOATING AUDIO WIDGET LOGIC
   ========================================================================== */
function initMiniAudio() {
    const audio = document.getElementById('links-audio');
    const playBtn = document.getElementById('mini-play-btn');
    const vinyl = document.getElementById('mini-vinyl');
    const titleMarquee = document.getElementById('mini-track-title');
    
    // Demo Track URL
    const demoTrackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    audio.src = demoTrackUrl;
    
    let isPlaying = false;
    
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            vinyl.classList.remove('playing');
            isPlaying = false;
        } else {
            audio.play().catch(e => console.log("Deferred play: ", e));
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            vinyl.classList.add('playing');
            isPlaying = true;
        }
    });

    // Handle languages on mini music title
    const trackTitles = {
        fr: "Rai Electro Club Mix 2026",
        ar: "ميكس راي الكترو 2026"
    };

    // Listen to language switch events
    const originalSwitch = window.switchLanguage;
    window.switchLanguage = function(lang) {
        if (originalSwitch) originalSwitch(lang);
        if (titleMarquee) {
            titleMarquee.textContent = trackTitles[lang] || trackTitles['fr'];
        }
    };
    
    // Set initial marquee text
    if (titleMarquee) {
        titleMarquee.textContent = trackTitles[currentLanguage] || trackTitles['fr'];
    }
}
