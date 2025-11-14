document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Select DOM Elements ---
    const textInput = document.getElementById('text-input');
    const outputPreview = document.getElementById('output-preview');
    const effectControls = document.getElementById('effect-controls');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const speedSlider = document.getElementById('speed-slider');

    let currentEffect = 'effect-none'; // Default effect

    // --- 2. Main Update Function ---
    function updatePreview() {
        const text = textInput.value;
        
        // Clear previous content and classes
        outputPreview.innerHTML = '';
        outputPreview.className = 'preview-box'; // Reset to base class
        
        // Get the currently selected effect
        const selectedEffectInput = document.querySelector('input[name="effect"]:checked');
        if (selectedEffectInput) {
            currentEffect = selectedEffectInput.value;
        }

        if (currentEffect === 'effect-none') {
            outputPreview.textContent = text;
            return;
        }

        // --- Special Case: Typewriter ---
        // This effect animates the container, not individual spans
        if (currentEffect === 'effect-typewriter') {
            outputPreview.classList.add(currentEffect);
            outputPreview.textContent = text; // Set plain text
            // Set custom property for character count, used by CSS 'steps()'
            outputPreview.style.setProperty('--chars', text.length);
            return; // Stop here for typewriter
        }

        // --- Default Case: Split text into <span> elements ---
        outputPreview.classList.add(currentEffect);

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            
            // Use non-breaking space for spaces to ensure they are rendered
            span.textContent = char === ' ' ? '\u00A0' : char;
            
            // Set the '--i' custom property for staggered animation delays
            span.style.setProperty('--i', index);
            
            outputPreview.appendChild(span);
        });
    }

    // --- 3. Event Listeners ---

    // Real-time update as user types
    textInput.addEventListener('input', updatePreview);

    // Update when a new effect is selected
    effectControls.addEventListener('change', updatePreview);

    // Clear button functionality
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updatePreview();
        textInput.focus();
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', () => {
        // Copy the plain text content, not the HTML
        navigator.clipboard.writeText(outputPreview.innerText)
            .then(() => {
                // Visual feedback
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Text';
                }, 1500);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });

    // Animation speed slider
    speedSlider.addEventListener('input', (e) => {
        // Update the '--anim-speed' CSS variable on the root element
        document.documentElement.style.setProperty('--anim-speed', e.target.value);
        
        // Re-run the update logic to apply new speed
        // This is important for CSS animations that depend on variables at creation time
        updatePreview();
    });

    // --- 4. Initial Call ---
    // Run once on load to format any default text (if any)
    updatePreview();

});
