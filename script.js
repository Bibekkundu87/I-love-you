document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Select DOM Elements ---
    const textInput = document.getElementById('text-input');
    const outputPreview = document.getElementById('output-preview');
    const effectsPanel = document.getElementById('effects-grid');
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
        
        if (currentEffect === 'effect-none') {
            outputPreview.textContent = text;
            return;
        }

        // --- Special Case: Typewriter & Neon ---
        // These effects animate the container, not individual spans
        if (currentEffect === 'effect-typewriter' || currentEffect === 'effect-neon') {
            outputPreview.classList.add(currentEffect);
            outputPreview.textContent = text; // Set plain text
            
            // Set custom property for character count, used by CSS 'steps()'
            if (currentEffect === 'effect-typewriter') {
                outputPreview.style.setProperty('--chars', text.length);
            }
            return; // Stop here for these effects
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

    // Use EVENT DELEGATION for effect buttons
    effectsPanel.addEventListener('click', (e) => {
        // Find the button that was clicked
        const clickedButton = e.target.closest('.effect-btn');
        
        if (!clickedButton) return; // Exit if click wasn't on a button

        // Remove 'active' class from all buttons
        effectsPanel.querySelectorAll('.effect-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add 'active' class to the clicked button
        clickedButton.classList.add('active');

        // Update the current effect
        currentEffect = clickedButton.dataset.effect;
        
        // Re-run the preview update
        updatePreview();
    });

    // Clear button functionality
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updatePreview();
        textInput.focus();
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputPreview.innerText)
            .then(() => {
                // Visual feedback
                copyBtn.innerHTML = '✅ Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copy Text';
                    copyBtn.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                copyBtn.innerHTML = '❌ Error';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copy Text';
                }, 2000);
            });
    });

    // Animation speed slider
    speedSlider.addEventListener('input', (e) => {
        // Update the '--anim-speed' CSS variable on the root element
        document.documentElement.style.setProperty('--anim-speed', e.target.value);
        
        // Re-run the update logic to apply new speed
        updatePreview();
    });

    // --- 4. Initial Call ---
    updatePreview();

});
