// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ----------------------------------------
     * RANDOM NUMBER GENERATOR
     * ----------------------------------------
     */
    const minNumInput = document.getElementById('min-num');
    const maxNumInput = document.getElementById('max-num');
    const generateNumBtn = document.getElementById('generate-num-btn');
    const clearNumBtn = document.getElementById('clear-num-btn');
    const numberResult = document.getElementById('number-result');
    const numError = document.getElementById('num-error');

    // Generate Button Click
    generateNumBtn.addEventListener('click', () => {
        const min = parseInt(minNumInput.value);
        const max = parseInt(maxNumInput.value);

        // --- Validation ---
        if (isNaN(min) || isNaN(max)) {
            showError('Both inputs must be valid numbers.');
            return;
        }
        if (min >= max) {
            showError('Minimum number must be less than maximum number.');
            return;
        }

        // --- If valid, generate ---
        hideError();
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        numberResult.textContent = randomNum;
    });

    // Clear Button Click
    clearNumBtn.addEventListener('click', () => {
        minNumInput.value = '1';
        maxNumInput.value = '100';
        numberResult.textContent = '--';
        hideError();
    });

    // Helper functions for number error
    function showError(message) {
        numError.textContent = message;
        numError.style.display = 'block';
        numberResult.textContent = '--';
    }
    function hideError() {
        numError.style.display = 'none';
    }

    /**
     * ----------------------------------------
     * COIN FLIPPER
     * ----------------------------------------
     */
    const flipCoinBtn = document.getElementById('flip-coin-btn');
    const coinVisual = document.getElementById('coin-visual');
    const coinResult = document.getElementById('coin-result');
    const flipHistoryList = document.getElementById('flip-history');
    const resetHistoryBtn = document.getElementById('reset-history-btn');

    let flipHistory = []; // State for the history
    const MAX_HISTORY = 10;

    // Flip Button Click
    flipCoinBtn.addEventListener('click', () => {
        // Disable button during animation
        flipCoinBtn.disabled = true;

        // Add flipping class for CSS animation
        coinVisual.classList.add('flipping');
        coinResult.textContent = 'Flipping...';

        // Determine result
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        // Wait for animation to finish (1s, matching CSS)
        setTimeout(() => {
            // Update visual and text
            if (result === 'Heads') {
                coinVisual.textContent = '😀'; // Emoji for Heads
                coinVisual.style.backgroundColor = 'var(--heads-color)';
                coinVisual.style.borderColor = '#f39c12';
            } else {
                coinVisual.textContent = '🪙'; // Emoji for Tails
                coinVisual.style.backgroundColor = 'var(--tails-color)';
                coinVisual.style.borderColor = '#138496';
            }
            coinResult.textContent = result;

            // Update state and UI
            updateFlipHistory(result);

            // Re-enable button and remove animation class
            flipCoinBtn.disabled = false;
            coinVisual.classList.remove('flipping');
        }, 1000); // 1000ms = 1s
    });

    // Reset History Button Click
    resetHistoryBtn.addEventListener('click', () => {
        flipHistory = [];
        renderFlipHistory();
    });

    // Add new flip to history and trim array
    function updateFlipHistory(result) {
        flipHistory.unshift(result); // Add to the beginning
        if (flipHistory.length > MAX_HISTORY) {
            flipHistory.pop(); // Remove the last item
        }
        renderFlipHistory();
    }

    // Render the history list in the UI
    function renderFlipHistory() {
        flipHistoryList.innerHTML = ''; // Clear current list
        if (flipHistory.length === 0) {
            flipHistoryList.innerHTML = '<li>No flips yet...</li>';
            return;
        }
        flipHistory.forEach(flip => {
            const li = document.createElement('li');
            li.textContent = flip;
            li.className = flip.toLowerCase(); // Adds .heads or .tails class
            flipHistoryList.appendChild(li);
        });
    }
    // Initial render on load
    renderFlipHistory();


    /**
     * ----------------------------------------
     * RANDOM NAME PICKER
     * ----------------------------------------
     */
    const nameListInput = document.getElementById('name-list');
    const pickNameBtn = document.getElementById('pick-name-btn');
    const clearNameBtn = document.getElementById('clear-name-btn');
    const nameCount = document.getElementById('name-count');
    const nameResult = document.getElementById('name-result');
    const prevNameResult = document.getElementById('prev-name-result');

    // Update name count live as user types
    nameListInput.addEventListener('input', updateNameCount);

    // Pick Name Button Click
    pickNameBtn.addEventListener('click', () => {
        const names = getNamesArray();
        
        if (names.length === 0) {
            nameResult.textContent = 'No names';
            prevNameResult.textContent = '--';
            return;
        }

        // Pick a random name
        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedName = names[randomIndex];

        // Move current winner to "previous"
        const currentWinner = nameResult.textContent;
        if (currentWinner !== '--' && currentWinner !== 'No names') {
            prevNameResult.textContent = currentWinner;
        }

        // Display new winner
        nameResult.textContent = selectedName;
    });

    // Clear Button Click
    clearNameBtn.addEventListener('click', () => {
        nameListInput.value = '';
        nameResult.textContent = '--';
        prevNameResult.textContent = '--';
        updateNameCount();
    });

    // Helper to get names from textarea
    function getNamesArray() {
        const text = nameListInput.value.trim();
        if (text === '') return [];
        
        // Split by comma OR newline, trim whitespace, and filter out empty strings
        return text.split(/[\n,]+/)
                   .map(name => name.trim())
                   .filter(name => name.length > 0);
    }

    // Helper to update the name count
    function updateNameCount() {
        const names = getNamesArray();
        nameCount.textContent = names.length;
    }

});