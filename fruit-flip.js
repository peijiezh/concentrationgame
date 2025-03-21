document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const gridSizeSelect = document.getElementById('grid-size');
    const timerDurationSelect = document.getElementById('timer-duration');
    const restartBtn = document.getElementById('restart-btn');
    const gameOverModal = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    const confettiContainer = document.getElementById('confetti-container');
  
    // Game state
    let score = 0;
    let timer = 60; // Default 1 minute
    let timerInterval;
    let cards = [];
    let flippedCards = [];
    let canFlip = true;
    let gridSize = '3x2'; // Default grid size
    let rows, cols;

    // Fruit names for the webp images - updated to match actual files
    const fruits = ['grapes', 'kiwi', 'orange', 'pear', 'pineapple', 'strawberry', 'watermelon'];

    // Helper function to adjust gameBoard sizing based on grid size
    function adjustGameBoard() {
        // Clear existing classes first
        gameBoard.classList.remove('grid-3x2', 'grid-3x4', 'grid-4x4');
        
        // Add the appropriate grid class
        gameBoard.classList.add(`grid-${gridSize}`);
        
        // Adjust the max size of the game board based on grid size to fit in viewport
        const container = document.querySelector('.game-container');
        const containerHeight = container.clientHeight;
        const headerHeight = document.querySelector('header').offsetHeight;
        const controlsHeight = document.querySelector('.game-controls').offsetHeight + 
                            document.querySelector('.timer-options').offsetHeight;
        const restartBtnHeight = document.querySelector('.restart-btn').offsetHeight;
        
        // Calculate available height for game board
        const availableHeight = containerHeight - headerHeight - controlsHeight - restartBtnHeight - 40; // 40px for margins
        
        // Set max height for game board
        gameBoard.style.maxHeight = `${availableHeight}px`;
    }

    // Initialize the game
    function initGame() {
        // Reset game state
        score = 0;
        scoreElement.textContent = score;
        flippedCards = [];
        canFlip = true;
        gameOverModal.classList.remove('active');
        
        // Clear existing cards and confetti
        gameBoard.innerHTML = '';
        confettiContainer.innerHTML = '';
        
        // Parse grid size
        [cols, rows] = gridSize.split('x').map(Number);
        
        // Set game board grid layout
        adjustGameBoard();
        
        // Create cards
        createCards();
        
        // Reset and start timer
        clearInterval(timerInterval);
        timer = parseInt(timerDurationSelect.value) * 60;
        updateTimerDisplay();
        startTimer();
    }

    // Create cards for the game
    function createCards() {
        const totalPairs = (rows * cols) / 2;
        let availableFruits = [...fruits];
        let selectedFruits = [];
        
        // Clear cards array
        cards = [];
        
        // Select random fruits for pairs
        for (let i = 0; i < totalPairs; i++) {
            const randomIndex = Math.floor(Math.random() * availableFruits.length);
            selectedFruits.push(availableFruits[randomIndex]);
            availableFruits.splice(randomIndex, 1);
            
            // If we run out of fruits, reset the available fruits
            if (availableFruits.length === 0) {
                availableFruits = [...fruits];
            }
        }
        
        // Create pairs of cards
        const cardPairs = [...selectedFruits, ...selectedFruits];
        
        // Shuffle the cards
        shuffleArray(cardPairs);
        
        // Create card elements
        cardPairs.forEach((fruit, index) => {
            createCard(fruit, index);
        });
    }

    // Create a card element
    function createCard(value, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.fruit = value;
        
        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">
                <img src="assets/images/fruits/${value}.webp" alt="${value}" class="fruit-image">
            </div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        cards.push(card);
    }

    // Flip a card
    function flipCard(card) {
        // Skip if card is already flipped or can't flip
        if (card.classList.contains('flipped') || !canFlip || flippedCards.includes(card)) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Check for a match if we have flipped two cards
        if (flippedCards.length === 2) {
            canFlip = false;
            checkForMatch();
        }
    }

    // Check if the two flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.fruit === card2.dataset.fruit) {
            // Match found
            setTimeout(() => {
                // Create confetti effect
                createConfetti(card1);
                createConfetti(card2);
                
                // Replace matched cards with new ones
                replaceMatchedCards(card1, card2);
                
                // Update score
                score += 10;
                scoreElement.textContent = score;
                
                flippedCards = [];
                canFlip = true;
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    // Create a new card to replace a matched card
    function createNewCard(value) {
        // Create a completely new card element
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.fruit = value;
        
        // Create card faces
        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        
        const fruitImage = document.createElement('img');
        fruitImage.src = `assets/images/fruits/${value}.webp`;
        fruitImage.alt = value;
        fruitImage.className = 'fruit-image';
        
        // Append elements in the correct order
        cardFront.appendChild(fruitImage);
        card.appendChild(cardBack);
        card.appendChild(cardFront);
        
        // Add event listener
        card.addEventListener('click', () => flipCard(card));
        
        return card;
    }
    
    // Replace matched cards with new ones
    function replaceMatchedCards(card1, card2) {
        // Get random fruits for new cards
        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        
        // Create confetti effect
        createConfetti(card1);
        createConfetti(card2);
        
        // Create new card elements
        const newCard1 = createNewCard(randomFruit);
        
        // Get a random position for the second card
        const randomCardIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomCardIndex];
        
        // Only swap if the random card isn't one of our matched cards
        if (randomCard !== card1 && randomCard !== card2) {
            // Get current random card value
            const randomCardValue = randomCard.dataset.fruit;
            
            // Create the second new card with the random fruit
            const newCard2 = createNewCard(randomFruit);
            
            // Create a replacement for the random card
            const newRandomCard = createNewCard(randomCardValue);
            
            // Replace the cards
            gameBoard.replaceChild(newCard1, card1);
            gameBoard.replaceChild(newRandomCard, card2);
            gameBoard.replaceChild(newCard2, randomCard);
            
            // Update the cards array
            cards = cards.map(card => {
                if (card === card1) return newCard1;
                if (card === card2) return newRandomCard;
                if (card === randomCard) return newCard2;
                return card;
            });
        } else {
            // Simply replace both matched cards with the same fruit
            const newCard2 = createNewCard(randomFruit);
            
            // Replace the matched cards
            gameBoard.replaceChild(newCard1, card1);
            gameBoard.replaceChild(newCard2, card2);
            
            // Update the cards array
            cards = cards.map(card => {
                if (card === card1) return newCard1;
                if (card === card2) return newCard2;
                return card;
            });
        }
        
        // Update score
        score += 10;
        scoreElement.textContent = score;
        
        // Reset flipped cards array
        flippedCards = [];
    }

    // Create confetti effect for matched cards
    function createConfetti(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position around the card
            const x = centerX + (Math.random() * 100 - 50);
            const y = centerY + (Math.random() * 100 - 50);
            
            // Random color
            const colors = ['#ff6b6b', '#4db6ac', '#ffb100', '#48c774', '#3273dc'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Random size
            const size = Math.random() * 8 + 5;
            
            // Random rotation
            const rotation = Math.random() * 360;
            
            // Set styles
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.backgroundColor = color;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            // Add animation
            confetti.style.animation = `confetti-fall ${Math.random() * 2 + 1}s forwards`;
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // Start the timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timer--;
            updateTimerDisplay();
            
            if (timer <= 0) {
                endGame();
            }
        }, 1000);
    }

    // Update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // End the game
    function endGame() {
        clearInterval(timerInterval);
        canFlip = false;
        
        finalScoreElement.textContent = score;
        gameOverModal.classList.add('active');
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Event listeners
    gridSizeSelect.addEventListener('change', (e) => {
        gridSize = e.target.value;
        initGame();
    });

    timerDurationSelect.addEventListener('change', () => {
        initGame();
    });

    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    // Handle window resize
    window.addEventListener('resize', () => {
        adjustGameBoard();
    });

    // Make sure cards have proper aspect ratio
    function fixCardAspectRatio() {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.style.aspectRatio = '3/4';
        });
    }

    // Observer to ensure cards maintain proper aspect ratio when added
    const observer = new MutationObserver(() => {
        fixCardAspectRatio();
    });

    observer.observe(gameBoard, {
        childList: true,
        subtree: true
    });

    // Start the game
    initGame();
});