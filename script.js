// Language Switching Logic
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    
    // Update active styles
    document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    // Auto-switch theme based on language
    if (lang === 'ja') {
        setTheme('night');
    } else {
        setTheme('day'); // Optional: switch back to day for English
    }
    
    // Update text / html content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key]; 
        }
    });

    // Update dynamic links (like lead capture forms)
    const links = document.querySelectorAll('[data-i18n-link]');
    links.forEach(link => {
        const key = link.getAttribute('data-i18n-link');
        if (translations[lang] && translations[lang][key]) {
            link.href = translations[lang][key];
        }
    });
}

function setTheme(mode) {
    const body = document.body;
    const btnDay = document.getElementById('icon-day');
    const btnNight = document.getElementById('icon-night');

    if (mode === 'night') {
        body.classList.remove('day-theme');
        body.classList.add('night-theme');
        if(btnNight) btnNight.style.display = 'none';
        if(btnDay) btnDay.style.display = 'inline';
    } else {
        body.classList.remove('night-theme');
        body.classList.add('day-theme');
        if(btnDay) btnDay.style.display = 'none';
        if(btnNight) btnNight.style.display = 'inline';
    }
}

// Theme Toggling Logic (Day/Night Cyberpunk)
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('day-theme')) {
        setTheme('night');
    } else {
        setTheme('day');
    }
}

// Mascot Collapse/Expand
let mascotCollapsed = false;

function toggleMascot() {
    const mascot = document.getElementById('mascot');
    const toggleBtn = document.getElementById('mascot-toggle');
    mascotCollapsed = !mascotCollapsed;
    
    if (mascotCollapsed) {
        mascot.classList.add('collapsed');
        toggleBtn.textContent = '🧑';
        toggleBtn.title = 'Show Guide';
    } else {
        mascot.classList.remove('collapsed');
        toggleBtn.textContent = '✕';
        toggleBtn.title = 'Hide Guide';
    }
}

// Contact Reveal Logic
function revealContact(type) {
    if (type === 'email') {
        const el = document.getElementById('contact-email');
        if(el) {
            const realEmail = el.getAttribute('data-val');
            el.innerHTML = `<a href="mailto:${realEmail}">${realEmail}</a>`;
            el.parentElement.onclick = null; // remove click listener
            el.parentElement.style.cursor = 'default';
        }
    } else if (type === 'phone') {
        const el = document.getElementById('contact-phone');
        if(el) {
            el.textContent = el.getAttribute('data-val');
            el.parentElement.onclick = null;
            el.parentElement.style.cursor = 'default';
        }
    }
}

// Mascot Drag Logic
function initMascotDrag() {
    const mascot = document.getElementById('mascot');
    if (!mascot) return;
    
    let isDragging = false;
    let startX, startY, origLeft, origBottom;
    let hasMoved = false;

    function onPointerDown(e) {
        // Prevent default to avoid text selection and scrolling
        e.preventDefault();
        isDragging = true;
        hasMoved = false;
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        
        // Get current position
        const rect = mascot.getBoundingClientRect();
        origLeft = rect.left;
        origBottom = window.innerHeight - rect.bottom;
        
        // Switch to left/bottom positioning for dragging
        mascot.style.left = origLeft + 'px';
        mascot.style.bottom = origBottom + 'px';
        mascot.style.right = 'auto';
        mascot.style.top = 'auto';
        mascot.classList.add('dragging');
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasMoved = true;
        }
        
        let newLeft = origLeft + dx;
        let newBottom = origBottom - dy;
        
        // Clamp within viewport
        const mascotWidth = mascot.offsetWidth;
        const mascotHeight = mascot.offsetHeight;
        newLeft = Math.max(-mascotWidth / 2, Math.min(window.innerWidth - mascotWidth / 2, newLeft));
        newBottom = Math.max(-mascotHeight / 2, Math.min(window.innerHeight - mascotHeight / 2, newBottom));
        
        mascot.style.left = newLeft + 'px';
        mascot.style.bottom = newBottom + 'px';
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        mascot.classList.remove('dragging');
    }

    // Mouse events
    mascot.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    
    // Touch events
    mascot.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
}

// *** FIX: Apply English translations immediately on load ***
setLanguage('en');

// Init mascot dragging
initMascotDrag();

// Animate Timeline Items
const timelineItems = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

timelineItems.forEach(item => observer.observe(item));

// Animate Progress Bars (Skills)
const skillBars = document.querySelectorAll('.progress-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const targetWidth = entry.target.getAttribute('data-target');
            entry.target.style.width = targetWidth;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// Accordion Toggle
function toggleAccordion(element) {
    element.classList.toggle('expanded');
}

// Sakura Petal Generator
function createPetal() {
    const container = document.getElementById('sakura-container');
    if(!container) return;
    
    // Only generate petals if the document is visible to save CPU
    if(document.hidden) return;

    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Randomize properties
    const size = Math.random() * 15 + 12;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    
    // Performance max cap
    if (container.childElementCount > 80) return;

    const fallDuration = Math.random() * 4 + 4;
    const swayDuration = Math.random() * 2 + 2;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.opacity = Math.random() * 0.4 + 0.4;
    
    container.appendChild(petal);
    
    // Remove after falling to free memory
    setTimeout(() => {
        if (petal.parentNode === container) {
            petal.remove();
        }
    }, fallDuration * 1000);
}

// Create a new petal every 150ms
setInterval(createPetal, 150);

// OTC Modal Logic
function openOtcModal(nodeId) {
    const modal = document.getElementById('otc-modal');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    
    if (!modal || !titleEl || !bodyEl || !translations[currentLang]) return;
    
    // Fetch data based on nodeId (e.g. 'inq', 'qt', 'so')
    const titleKey = `modal-${nodeId}-title`;
    const dataKey = `modal-${nodeId}-data`;
    
    titleEl.innerHTML = translations[currentLang][titleKey] || "Data Unavailable";
    bodyEl.innerHTML = translations[currentLang][dataKey] || "Please check configuration.";
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeOtcModal() {
    const modal = document.getElementById('otc-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; 
    }
}

// Close overlay if clicked outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('otc-modal');
    if(modal) {
        modal.addEventListener('click', closeOtcModal);
    }
});
