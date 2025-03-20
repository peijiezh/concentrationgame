# Product Requirements Document (PRD)
Pseudo-3D Flip Concentration Game
Date: March 18, 2025
Author: peijie
Version: 5.0  


## 1. Overview

### 1.1 Purpose
Develop a web-based concentration game using flat cards that flip quickly to reveal patterns. Players match pairs—same fruit—in a classic concentration style. The game launches directly into play with grid size options (3x2, 3x4, 4x4), default 3x2 option for instant access.  

### 1.2 Objective
Offer a fast, familiar memory game with a modern simple grid size choices.  

Engage players instantly with snappy flips, bold visuals, and evolving challenges, playable on desktop and mobile.  

Build a foundation for future enhancements (e.g., new patterns, modes).


## 2. Game Concept

###2.1 Core Gameplay
Structure: A grid of cards with options of 3x2 (6 cards), 3x4 (12 cards), or 4x4 (16 cards), defaulting to 3x2. All cards start face-down.  

Objective: Match pairs of cards with the same fruit(e.g., apple to apple) by flipping two at a time, 

Dynamic mechanic: When a pair is matched, those cards swap for new ones with fresh patterns (same shape, different colors), cards will shack into peices and turn into confettis to celebrate and a new pair is added to the pool to keep it evolving.

### 2.2 Key Features
cards Flip: Cards flip, starting face-down and revealing patterns on click or tap.  

Pattern Matching: Pairs are identical fruits (e.g., apple , banana), drawn from a vibrant palette.  

Grid Size Options: Players choose from 3x2 (6 cards), 3x4 (12 cards), or 4x4 (16 cards), with 3x2 as default.  

Scoring: 10 Points per match.

Timer: 1 minutes countdown default, users can choose 1, 2, 3, 4, 5 minutes countdown, and shown as list choices.


## 3. User Interface (UI)

### 3.1 Homepage
Visual: cards in a square layout (stacked vertically on mobile), flipping face-down to face-up to reveal their fruits (e.g., apple, banana).  
Text: Tagline (e.g., “Flip. Match. Shine.”) and a “Play Now” button, scaled for touch on mobile.  
Interaction: cards on desktop; tap zooms it on mobile. 

### 3.2 Game Screen
Card Grid: Configurable 3x2 (6 cards), 3x4 (12 cards), or 4x4 (16 cards), defaulting to 3x2—centered on-screen. On mobile, grid scales responsively (e.g., smaller cards for 4x4 to fit). All cards start face-down. All cards show in one screen.
Patterns: Revealed cards show shapes (e.g., apple, banana, chestnut) on creamy Whites background
Controls:  
Desktop: Click a card to flip it face-up.  
Mobile: Tap to flip, optimized for touch accuracy (larger hitboxes).  
Flip a second card to match (same shape, different color); if matched, both swap for new ones; if not, flip back after 1 second.  
HUD: Score top-left, timer (if active) top middle, grid choice topp-right, “Restart” button bottom-center. On mobile, HUD elements shrink and reposition (e.g., score/timer/grid at top, restart below grid).make sure “Restart” button show on the current screen.

### 3.3 Aesthetics
Style: Playful Cartoon  
Look: Bright, saturated colors (e.g., sunny yellows, lime greens), rounded edges, hand-drawn icons or illustrations.  
Vibe: Fun and kid-friendly, like a board game come to life.  
Details: Cards wobble or bounce when flipped, cartoonish fonts (e.g., Comic Sans or Bubblegum Sans), confetti for successful match.  
Best for: Casual players or a younger audience.


## 4. Functional Requirements

### 4.1 Gameplay Logic
Grid Setup: Generate a grid of cards (3x2, 3x4, 4x4; default 3x2). All cards start face-down, scaling responsively on mobile.  

Pattern Generation: Assign random shapes (e.g., apple, banana, chestnut), ensuring even pairs (same shape). E.g., 3x2 has 3 pairs.  

Matching: Flip two cards: match same fruit swaps them for new cards; no match flips them back after 1 second.  

Dynamic mechanic: When a pair is matched, those cards swap for new ones with fresh patterns (same shape, different colors), cards will shack into peices and turn into confettis to celebrate and a new pair is added, maintaining pair count to the pool to keep it evolving.


### 4.2 Card Design
Faces: One face-up side per card, face-down side neutral (e.g., gray).  
Colors & Patterns: Shapes (apple, banana, watermelon, chestnut, cherry, pineapple, avocado, pear, grape, orange, peach) 



## 5. Technical Requirements

### 5.1 Platform
Web-based, compatible with modern desktop browsers (Chrome, Firefox, Safari) and mobile browsers (iOS Safari, Android Chrome).

### 5.2 Tools
Frontend: HTML5/CSS/JavaScript, using responsive design (e.g., flexbox, media queries) for mobile scaling.  

### 5.3 Performance
Target 60 FPS on mid-range devices (e.g., 2020 laptops, 2022 phones like iPhone 13 or mid-tier Android).  
Flip animation locked at 0.3 seconds max, no lag on grids up to 4x4 (16 cards) on mobile.  
Optimize touch handling (larger hitboxes) and pattern swaps for smooth mobile play.


## 6. Success Metrics
Engagement: Average 3+ rounds per session across grid sizes, on both desktop and mobile.  
Retention: 20% return rate within a week, consistent across platforms.  
Feedback: Positive notes on flip speed, touch controls, and same-shape-different-color matching.


## 7. Next Steps
tbc...
