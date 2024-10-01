# Alien Invaders 👾👾

**Alien Invaders** is a fun and engaging space shooter game built using **HTML**, **CSS**, and **JavaScript**. Players control a spaceship, shoot down alien invaders, and aim to survive while scoring as many points as possible. The game is responsive and works across various screen sizes.

## Table of Contents

- [Game Overview](#game-overview)
- [Game Mechanics](#game-mechanics)
- [Screens](#screens)
- [Features](#features)
- [Technologies](#technologies)
- [How to Play](#how-to-play)
- [Next Steps](#next-steps)
- [How to Run the Game](#how-to-run-the-game)

## Game Overview

**Alien Invaders** is an arcade-style space shooter. The player's goal is to destroy as many alien invaders as possible while avoiding being hit by enemy fire. The game gets progressively harder, with increasing alien numbers and speed.

## Game Mechanics

- **Player Movement**: The player controls a spaceship that can move left and right. The spaceship also rotates slightly to add a dynamic feel to the movement.
- **Shooting**: The player can shoot projectiles to destroy alien invaders.
- **Lives**: The player starts with 3 lives. Each time an enemy projectile hits the spaceship, the player loses a life. When all lives are lost, the game ends.
- **Scoring**: For every alien destroyed, the player earns 100 points.
- **Particle Effects**: When the player or an alien is hit, particles explode to simulate destruction. The background is filled with floating particles to simulate the feeling of being in space.

## Screens

### 1. Start Screen

- The start screen welcomes players with the game title and a "Start Game" button. Upon clicking, the game begins.

### 2. Game Screen

- The player controls the spaceship, shoots aliens, and tries to survive while scoring points. The player's current score and remaining lives are displayed at the top of the screen.

### 3. Game Over Screen

- When the player loses all lives, the game over screen is displayed with the final score and the highest score stored in **localStorage**. The player can restart the game using the "Restart" button.

## Features

- **Fully Responsive**: The game adjusts to various screen sizes, ensuring a smooth experience on both desktop and mobile devices.
- **Local High Score**: The game stores the highest score in the browser's localStorage so players can try to beat their previous high scores.
- **Particle Effects**: The game features particle explosions when aliens or the player's spaceship are destroyed.
- **Sound Effects**: Includes various sound effects to enhance the gameplay:
  - **Shooting** sound when the player fires a projectile.
  - **Alien Death** sound when an alien is destroyed.
  - **Player Death** sound when the player loses a life.
  - **Game Over Music** that plays when the game ends.

## Technologies

- **HTML5**: For the structure and canvas.
- **CSS3**: For styling the screens and ensuring responsiveness.
- **JavaScript**: For game mechanics, rendering, and user interactions.
- **LocalStorage**: For saving the high score.
- **Audio Effects**: To add immersive sounds to the game.

## How to Play

1. **Start the Game**: Press the "Start Game" button on the start screen.
2. **Move the Spaceship**: Use the left (`←`) and right (`→`) arrow keys to move the spaceship.
3. **Shoot Aliens**: Press the space bar (`SPACE`) to shoot projectiles at aliens.
4. **Avoid Enemy Fire**: Dodge the enemy projectiles to avoid losing lives.
5. **Game Over**: If you lose all 3 lives, the game will end, and the final score will be displayed. You can restart by clicking the "Restart" button.

### Mobile Controls:

- Tap the left side of the screen to move left and the right side to move right.
- Tap the center to shoot.

## How to Run the Game

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/alien-invaders.git
   ```
2. Open the Project: Open the index.html file in your browser.
3. Play: Start the game and enjoy!
