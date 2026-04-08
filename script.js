// Default language
let currentLang = 'en';

// Function to update the DOM elements with translation mapping
function applyTranslations(lang) {
    if (!translations[lang]) return;

    const dataDict = translations[lang];

    // Find all elements with a data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dataDict[key]) {
            el.textContent = dataDict[key];
        }
    });

    // Update body class for specific font styling if needed
    if(lang === 'ja') {
        document.body.style.fontFamily = "'Noto Sans JP', sans-serif";
    } else {
        document.body.style.fontFamily = "'Inter', sans-serif";
    }
}

// Function triggered by language toggle switch
function setLanguage(lang) {
    if (lang === currentLang) return;
    
    currentLang = lang;
    
    // Update active class on toggle buttons
    document.getElementById('lang-en').classList.remove('active');
    document.getElementById('lang-ja').classList.remove('active');
    document.getElementById('lang-' + lang).classList.add('active');

    // Add a quick fade out and fade in effect for smooth transition
    const mainContent = document.querySelector('main');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(10px)';
    mainContent.style.transition = 'all 0.3s ease';

    setTimeout(() => {
        applyTranslations(lang);
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 300);
}

// Initialize Translations on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(currentLang);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
