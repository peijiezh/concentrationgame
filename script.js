 // Game state
let gameState = {
    cards: [],
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    matches: 0,
    timer: 0,
    timerInterval: null,
    gameStarted: false,
    difficulty: 'medium', // easy, medium, hard
    totalPairs: 0
};

// DOM Elements
const gameGrid = document.getElementById('game-grid');
const moveCounter = document.getElementById('moves');
const matchCounter = document.getElementById('matches');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');
const difficultyButton = document.getElementById('difficulty');
const messageContainer = document.getElementById('message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const messageFocus = document.getElementById('message-focus');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');
const playAgainButton = document.getElementById('play-again');

// Card symbols (using emojis for easy implementation)
const easySymbols = ['🍎', '🍌', '🍒', '🍓', '🍋', '🍉'];
const mediumSymbols = ['🍎', '🍌', '🍒', '🍓', '🍋', '🍉', '🥭', '🍇', '🥝'];
const hardSymbols = ['🍎', '🍌', '🍒', '🍓', '🍋', '🍉', '🥭', '🍇', '🥝', '🍍', '🥑', '🍐'];

// Helper Functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    if (gameState.timerInterval) return;
    
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        timerDisplay.textContent = formatTime(gameState.timer);
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
}

// Game Functions
function getSymbolsForDifficulty() {
    switch (gameState.difficulty) {
        case 'easy':
            gameState.totalPairs = 6;
            return easySymbols;
        case 'hard':
            gameState.totalPairs = 12;
            return hardSymbols;
        case 'medium':
        default:
            gameState.totalPairs = 9;
            return mediumSymbols;
    }
}

function createDeck() {
    const symbols = getSymbolsForDifficulty();
    const pairs = gameState.totalPairs;
    const selectedSymbols = symbols.slice(0, pairs);
    
    // Create pairs
    const deck = [...selectedSymbols, ...selectedSymbols];
    return shuffle(deck);
}

function createCardElement(symbol, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = symbol;
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', () => flipCard(card));
    
    return card;
}

function setupGame() {
    // Reset game state
    gameState.cards = [];
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.lockBoard = false;
    gameState.moves = 0;
    gameState.matches = 0;
    gameState.timer = 0;
    gameState.gameStarted = false;
    
    // Stop timer if running
    stopTimer();
    
    // Reset display
    timerDisplay.textContent = '00:00';
    moveCounter.textContent = '0';
    matchCounter.textContent = '0';
    
    // Clear grid
    gameGrid.innerHTML = '';
    
    // Set grid columns based on difficulty
    if (gameState.difficulty === 'easy') {
        gameGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (gameState.difficulty === 'medium') {
        gameGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    } else {
        gameGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
    }
    
    // Create and add cards
    const deck = createDeck();
    deck.forEach((symbol, index) => {
        const card = createCardElement(symbol, index);
        gameState.cards.push(card);
        gameGrid.appendChild(card);
    });
    
    // Hide message if visible
    messageContainer.classList.add('hidden');
}

function flipCard(card) {
    // Prevent flipping if board is locked or card is already flipped or matched
    if (gameState.lockBoard || 
        card === gameState.firstCard || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched')) {
        return;
    }
    
    // Start the game on first card flip
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        startTimer();
    }
    
    // Flip the card
    card.classList.add('flipped');
    
    // First card selection
    if (!gameState.firstCard) {
        gameState.firstCard = card;
        return;
    }
    
    // Second card selection
    gameState.secondCard = card;
    gameState.moves++;
    moveCounter.textContent = gameState.moves;
    
    // Check for match
    checkForMatch();
}

function checkForMatch() {
    const firstCardSymbol = gameState.firstCard.querySelector('.card-front').textContent;
    const secondCardSymbol = gameState.secondCard.querySelector('.card-front').textContent;
    
    if (firstCardSymbol === secondCardSymbol) {
        // Cards match
        disableCards();
        gameState.matches++;
        matchCounter.textContent = gameState.matches;
        
        // Check if game is complete
        if (gameState.matches === gameState.totalPairs) {
            setTimeout(endGame, 500);
        }
    } else {
        // Cards don't match
        unflipCards();
    }
}

function disableCards() {
    gameState.firstCard.classList.add('matched');
    gameState.secondCard.classList.add('matched');
    
    resetBoard();
}

function unflipCards() {
    gameState.lockBoard = true;
    
    setTimeout(() => {
        gameState.firstCard.classList.remove('flipped');
        gameState.secondCard.classList.remove('flipped');
        
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [gameState.firstCard, gameState.secondCard] = [null, null];
    gameState.lockBoard = false;
}

function endGame() {
    stopTimer();
    
    // Show completion message
    finalTime.textContent = formatTime(gameState.timer);
    finalMoves.textContent = gameState.moves;
    
    // Provide feedback based on performance
    let performanceMessage = '';
    const avgMovesPerPair = gameState.moves / gameState.totalPairs;
    
    if (avgMovesPerPair <= 2.2) {
        performanceMessage = 'Excellent focus! Your attention is sharp!';
    } else if (avgMovesPerPair <= 3) {
        performanceMessage = 'Good job! Your concentration is improving.';
    } else {
        performanceMessage = 'Keep practicing! Focus on card positions to improve.';
    }
    
    messageFocus.textContent = performanceMessage;
    messageContainer.classList.remove('hidden');
}

function changeDifficulty() {
    // Cycle through difficulties
    if (gameState.difficulty === 'easy') {
        gameState.difficulty = 'medium';
        difficultyButton.textContent = 'Change Difficulty (Medium)';
    } else if (gameState.difficulty === 'medium') {
        gameState.difficulty = 'hard';
        difficultyButton.textContent = 'Change Difficulty (Hard)';
    } else {
        gameState.difficulty = 'easy';
        difficultyButton.textContent = 'Change Difficulty (Easy)';
    }
    
    setupGame();
}

// Event Listeners
restartButton.addEventListener('click', setupGame);
difficultyButton.addEventListener('click', changeDifficulty);
playAgainButton.addEventListener('click', setupGame);

// Initialize the game
difficultyButton.textContent = `Change Difficulty (${gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)})`;
setupGame();