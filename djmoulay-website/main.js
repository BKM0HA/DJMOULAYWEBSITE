/* ==========================================================================
   AMBIENT BACKGROUND CANVAS ANIMATION
   ========================================================================== */
const ambientCanvas = document.getElementById('ambient-canvas');
const ambientCtx = ambientCanvas.getContext('2d');

let width = (ambientCanvas.width = window.innerWidth);
let height = (ambientCanvas.height = window.innerHeight);

window.addEventListener('resize', () => {
    width = (ambientCanvas.width = window.innerWidth);
    height = (ambientCanvas.height = window.innerHeight);
});

// Particles and spotlights
const particles = [];
const spotlights = [];

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * -1 - 0.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#d4af37' : '#ff3b30'; // Gold or Red
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < 0) this.reset();
    }
    draw() {
        ambientCtx.fillStyle = this.color;
        ambientCtx.globalAlpha = this.opacity;
        ambientCtx.beginPath();
        ambientCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ambientCtx.fill();
    }
}

class Spotlight {
    constructor() {
        this.x = Math.random() * width;
        this.y = -50;
        this.radius = Math.random() * 150 + 100;
        this.speed = Math.random() * 0.005 + 0.002;
        this.angle = Math.random() * Math.PI;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.color = Math.random() > 0.5 ? 'rgba(212, 175, 55, ' : 'rgba(52, 199, 89, '; // Gold or Green
    }
    update() {
        this.angle += this.speed;
        this.currentX = this.x + Math.sin(this.angle) * 150;
    }
    draw() {
        const grad = ambientCtx.createRadialGradient(
            this.currentX, this.y, 10,
            this.currentX, this.y + 400, this.radius
        );
        grad.addColorStop(0, this.color + this.opacity + ')');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        
        ambientCtx.fillStyle = grad;
        ambientCtx.globalAlpha = 1;
        ambientCtx.beginPath();
        ambientCtx.moveTo(this.currentX - 50, 0);
        ambientCtx.lineTo(this.currentX + 50, 0);
        ambientCtx.lineTo(this.currentX + Math.sin(this.angle) * 300 + 150, height);
        ambientCtx.lineTo(this.currentX + Math.sin(this.angle) * 300 - 150, height);
        ambientCtx.closePath();
        ambientCtx.fill();
    }
}

// Initialize ambient components
for (let i = 0; i < 60; i++) particles.push(new Particle());
for (let i = 0; i < 3; i++) spotlights.push(new Spotlight());

function animateAmbient() {
    ambientCtx.clearRect(0, 0, width, height);
    
    // Draw spotlights
    spotlights.forEach(spot => {
        spot.update();
        spot.draw();
    });
    
    // Draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateAmbient);
}
animateAmbient();

/* ==========================================================================
   NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link:not(.highlight)');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    
    // Animate hamburger lines
    const lines = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        const lines = hamburger.querySelectorAll('span');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    });
});

/* ==========================================================================
   MULTILINGUAL TRANSLATION SYSTEM
   ========================================================================== */
let currentLanguage = localStorage.getItem('djmoulay_lang') || 'fr';

const formPlaceholders = {
    fr: {
        name: "Ex: Karim Benhamadi",
        phone: "Ex: +213 XXXXXXXXX",
        location: "Ex: Oran, Algérie",
        details: "Nombre d'invités, sonorisation requise, souhaits musicaux..."
    },
    ar: {
        name: "مثال: كريم بن حمادي",
        phone: "مثال: +213 XXXXXXXXX",
        location: "مثال: وهران، الجزائر",
        details: "عدد الضيوف، هندسة الصوت المطلوبة، الطلبات الموسيقية..."
    }
};

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
            el.innerHTML = text; // supports HTML markers
        }
    });

    // Update form placeholders
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const locationInput = document.getElementById('location');
    const detailsInput = document.getElementById('details');
    
    if (nameInput) nameInput.placeholder = formPlaceholders[lang].name;
    if (phoneInput) phoneInput.placeholder = formPlaceholders[lang].phone;
    if (locationInput) locationInput.placeholder = formPlaceholders[lang].location;
    if (detailsInput) detailsInput.placeholder = formPlaceholders[lang].details;
    
    // Update WhatsApp links based on language
    updateWhatsAppLink();
}

/* ==========================================================================
   PREMIUM AUDIO PLAYER & VISUALIZER
   ========================================================================== */
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const muteBtn = document.getElementById('mute-btn');
const vinyl = document.getElementById('vinyl');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

// SoundHelix playlist fallback since user will upload their own audio later
const playlist = [
    {
        name: "Rai Electro Club Mix 2026 (Demo)",
        nameAr: "ميكس راي الكترو 2026 (تجريبي)",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        name: "Algerian Club Beat (Rai Gold)",
        nameAr: "إيقاع راي ذهبي جزائري",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
];
let currentTrackIndex = 0;
let isPlaying = false;

// Audio context visualizer variables
let audioContext;
let analyser;
let source;
let dataArray;
let isVisualizerInitialized = false;

// Set initial audio source
audio.src = playlist[currentTrackIndex].url;

// Format duration helper
function formatTime(secs) {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Update Duration metadata
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// Update Progress Time
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Seek Track
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// Play/Pause Action
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

function playTrack() {
    isPlaying = true;
    audio.play().catch(e => console.log("Audio play deferred for user interaction: ", e));
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    vinyl.classList.add('playing');
    
    // Initialize Web Audio Visualizer on first user interaction
    if (!isVisualizerInitialized) {
        initVisualizer();
    }
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    vinyl.classList.remove('playing');
}

// Next/Prev track
nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
});

prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
});

function loadTrack(index) {
    audio.src = playlist[index].url;
    
    // Update track text content
    const trackNameEl = document.getElementById('track-name');
    trackNameEl.setAttribute('data-fr', playlist[index].name);
    trackNameEl.setAttribute('data-ar', playlist[index].nameAr);
    trackNameEl.textContent = currentLanguage === 'ar' ? playlist[index].nameAr : playlist[index].name;
    
    if (isPlaying) {
        audio.play().catch(e => console.log(e));
    }
}

// Mute toggle
muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
});

// Audio Visualizer Canvas Implementation
const visualizerCanvas = document.getElementById('audio-visualizer');
const visualizerCtx = visualizerCanvas.getContext('2d');
visualizerCanvas.width = 600;
visualizerCanvas.height = 120;

function initVisualizer() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        isVisualizerInitialized = true;
    } catch (err) {
        console.warn("Web Audio API not fully supported or restricted. Using fallback synthetic animation.", err);
    }
}

// Animation loop for visualizer
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    
    const w = visualizerCanvas.width;
    const h = visualizerCanvas.height;
    
    // Clear canvas with subtle trail effect
    visualizerCtx.fillStyle = 'rgba(9, 9, 11, 0.2)';
    visualizerCtx.fillRect(0, 0, w, h);
    
    if (isVisualizerInitialized && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        
        const barWidth = (w / dataArray.length) * 1.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] * 0.45;
            
            // Generate glowing gold gradient for bars
            const grad = visualizerCtx.createLinearGradient(0, h, 0, h - barHeight);
            grad.addColorStop(0, '#d4af37');
            grad.addColorStop(1, '#ff3b30');
            
            visualizerCtx.fillStyle = grad;
            visualizerCtx.fillRect(x, h - barHeight, barWidth - 3, barHeight);
            
            x += barWidth;
        }
    } else {
        // Fallback or Idle state: draw smooth synthetic wave
        visualizerCtx.beginPath();
        visualizerCtx.lineWidth = 2;
        visualizerCtx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        
        const sliceWidth = w / 100;
        let x = 0;
        
        for (let i = 0; i < 100; i++) {
            const time = Date.now() * 0.003;
            // Wave amplitude depends on whether audio is playing
            const amplitude = isPlaying ? 35 : 5;
            const y = h / 2 + Math.sin(i * 0.15 + time) * amplitude * Math.cos(i * 0.02 + time * 0.5);
            
            if (i === 0) {
                visualizerCtx.moveTo(x, y);
            } else {
                visualizerCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        visualizerCtx.stroke();
    }
}
drawVisualizer();

/* ==========================================================================
   BOOKING DYNAMIC FORM & WHATSAPP REDIRECT
   ========================================================================== */
const WHATSAPP_NUMBER = "213550324525"; // Replace with DJ Moulay's real WhatsApp number

function updateWhatsAppLink() {
    const waBtn = document.getElementById('whatsapp-direct-btn');
    if (!waBtn) return;
    
    let text = "";
    if (currentLanguage === 'ar') {
        text = encodeURIComponent("مرحباً دي جي مولاي، أرغب في حجز خدماتكم لإحياء حفلي. يرجى تزويدي بالتفاصيل.");
    } else {
        text = encodeURIComponent("Bonjour DJ Moulay, je souhaite réserver vos services pour mon événement. Merci de me recontacter.");
    }
    
    waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
updateWhatsAppLink();

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnHTML = submitBtn.innerHTML;
    
    // Disable button & show spinner
    submitBtn.disabled = true;
    if (currentLanguage === 'ar') {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
    } else {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
    }
    
    // Prepare form data
    const formData = new FormData(form);
    
    // Send AJAX request
    fetch('https://formsubmit.co/ajax/contact@djmoulay.com', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            form.reset();
            submitBtn.style.background = 'var(--color-green)';
            submitBtn.style.color = '#fff';
            submitBtn.style.boxShadow = '0 0 15px rgba(52, 199, 89, 0.4)';
            
            if (currentLanguage === 'ar') {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم إرسال الطلب بنجاح!';
            } else {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Demande envoyée avec succès !';
            }
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.style.boxShadow = '';
                submitBtn.innerHTML = originalBtnHTML;
                switchLanguage(currentLanguage);
            }, 5000);
        } else {
            throw new Error('Response error');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        submitBtn.disabled = false;
        submitBtn.style.background = 'var(--color-red)';
        submitBtn.style.color = '#fff';
        
        if (currentLanguage === 'ar') {
            submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> فشل الإرسال. حاول مرة أخرى.';
        } else {
            submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Échec de l\'envoi. Réessayez.';
        }
        
        setTimeout(() => {
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.innerHTML = originalBtnHTML;
            switchLanguage(currentLanguage);
        }, 5000);
    });
}

// Initial language setup on load
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage(currentLanguage);
});
