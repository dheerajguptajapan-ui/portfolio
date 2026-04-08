// Language Switching Logic
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    
    // Update active styles
    document.querySelectorAll('.lang-option').forEach(el => el.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update text content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update current mascot bubble if changing language while viewing a zone
    updateMascotBubble(currentZone);
}

// Theme Toggling Logic (Day/Night Cyberpunk)
function toggleTheme() {
    const body = document.body;
    const btnDay = document.getElementById('icon-day');
    const btnNight = document.getElementById('icon-night');

    if (body.classList.contains('day-theme')) {
        body.classList.replace('day-theme', 'night-theme');
        btnNight.style.display = 'none';
        btnDay.style.display = 'inline';
    } else {
        body.classList.replace('night-theme', 'day-theme');
        btnDay.style.display = 'none';
        btnNight.style.display = 'inline';
    }
}

// Scroll Intersection Observers for Animations and Character Trigger
let currentZone = 'hero';

document.addEventListener("DOMContentLoaded", () => {
    
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

    // Zone Tracking for Character Dialogue
    const zones = document.querySelectorAll('.zone');
    const zoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const zoneId = entry.target.getAttribute('data-zone');
                if (zoneId !== currentZone) {
                    currentZone = zoneId;
                    updateMascotBubble(zoneId);
                }
            }
        });
    }, { threshold: 0.6 });

    zones.forEach(zone => zoneObserver.observe(zone));
});

// Function to update mascot text with brief animation
function updateMascotBubble(zoneId) {
    const bubble = document.getElementById('mascot-bubble');
    const key = `mascot-${zoneId}`;
    
    bubble.classList.remove('show');
    
    setTimeout(() => {
        if (translations[currentLang][key]) {
            bubble.textContent = translations[currentLang][key];
            bubble.setAttribute('data-i18n', key);
            bubble.classList.add('show');
        }
    }, 150); // Wait for fade out
}

// Accordion Toggle
function toggleAccordion(element) {
    // If we only want one open at a time, we could close others here
    // document.querySelectorAll('.timeline-item').forEach(item => {
    //     if(item !== element) item.classList.remove('expanded');
    // });
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
    const size = Math.random() * 15 + 12; // 12px to 27px (Bigger petals)
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${Math.random() * 100}vw`; // Random horizontal start position
    
    // Performance max cap: fallback if tab goes out of focus heavily
    if (container.childElementCount > 80) return;

    const fallDuration = Math.random() * 4 + 4; // 4s to 8s fall (slightly faster fall because they are bigger)
    const swayDuration = Math.random() * 2 + 2; // 2s to 4s sway
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.opacity = Math.random() * 0.4 + 0.4; // 0.4 to 0.8
    
    container.appendChild(petal);
    
    // Remove after falling to free memory
    setTimeout(() => {
        if (petal.parentNode === container) {
            petal.remove();
        }
    }, fallDuration * 1000);
}

// Create a new petal more frequently (every 150ms)
setInterval(createPetal, 150);
