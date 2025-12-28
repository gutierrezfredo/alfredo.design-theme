/**
 * Theme Toggle with SVG Icons
 * Toggles between light and dark mode with sun/moon icons
 */
(function() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const html = document.documentElement;
    const sunIcon = toggle.querySelector('.sun-icon');
    const moonIcon = toggle.querySelector('.moon-icon');
    const labelLight = toggle.querySelector('.toggle-label-light');
    const labelDark = toggle.querySelector('.toggle-label-dark');

    // Get current theme
    function getTheme() {
        return localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    // Tint colors for subscribe card
    const tints = [
        'rgba(99, 179, 237, 0.08)',
        'rgba(154, 230, 180, 0.08)',
        'rgba(246, 173, 85, 0.08)',
        'rgba(183, 148, 244, 0.08)'
    ];
    const darkTints = [
        'rgba(99, 179, 237, 0.12)',
        'rgba(154, 230, 180, 0.12)',
        'rgba(246, 173, 85, 0.12)',
        'rgba(183, 148, 244, 0.12)'
    ];

    // Update icon and label visibility based on current theme
    // Show moon + "Dark" in dark mode (current mode)
    // Show sun + "Light" in light mode (current mode)
    function updateIcon(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            if (labelLight) labelLight.style.display = 'none';
            if (labelDark) labelDark.style.display = '';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            if (labelLight) labelLight.style.display = '';
            if (labelDark) labelDark.style.display = 'none';
        }
        // Update subscribe tint for theme
        var idx = parseInt(getComputedStyle(html).getPropertyValue('--subscribe-tint-idx')) || 0;
        html.style.setProperty('--subscribe-tint', theme === 'dark' ? darkTints[idx] : tints[idx]);
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    }

    // Initialize
    updateIcon(getTheme());
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateIcon(newTheme);
        }
    });
})();
