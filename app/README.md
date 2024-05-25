# App Directory

The `app/` directory encompasses the development of an interactive drawing game with multiple game modes and a scoreboard to track player performance.

## Project Workflow

1. **User Interface Development**
    - The user interface is developed using `HTML`, `CSS`, and `JavaScript`.

2. **Game Mode Implementation**
    - Two game modes are implemented: Clock Mode and AI Mode.

3. **Scoreboard and Database Integration**
    - The results of the games are stored in a database, and a scoreboard is displayed at the end of each game session to highlight the top 3 best players.

## Repository Structure

| File/Folder        | Description                                                                                       |
|--------------------|---------------------------------------------------------------------------------------------------|
| `css/`             | Contains the stylesheet (`style.css`) for styling the HTML files.                                 |
| `images/`          | Contains images used in the game, including a `sketch` folder with sketches for AI mode.          |
| `js/`              | Contains JavaScript files that control the game logic for each HTML file.                         |
| `ai_game.html`     | HTML file for the AI game mode, where players compete against an AI to draw the predicted object. |
| `clock_game.html`  | HTML file for the Clock game mode, where players draw the predicted object before the time runs out.|
| `end_game.html`    | HTML file that displays the scoreboard and player performance after the game ends.                |
| `game.html`        | HTML file for the game settings, where players choose difficulty and number of rounds.            |
| `index.html`       | Main home page where players choose between Clock Mode and AI Mode.                               |

## Getting Started


## Game Modes

1. **Clock Mode (`clock_game.html`):**
    - Players must draw the predicted object before the timer reaches 00:00.
    - The number of rounds is based on the player's selection in the settings.

2. **AI Mode (`ai_game.html`):**
    - Players compete against an AI to draw the predicted object within a set time interval.
    - The difficulty level affects the AI's drawing speed.

## Files Description

- ## HTML Files Overview

- **index.html**
  - The main homepage that serves as the entry point to the game. Users can choose between Clock Mode and AI Mode.
- **game.html**
  - A setup page where users select game difficulty, number of rounds, and start the game based on their chosen mode.
- **clock_game.html**
  - The game page for Clock Mode. Players draw the specified object before time runs out, with the number of rounds based on previous selections.
- **ai_game.html**
  - The game page for AI Mode. Players compete against an AI robot to draw the specified object within a given time interval, with the difficulty affecting the AI's drawing speed.
- **end_game.html**
  - Displays the final scoreboard, including player name, chosen difficulty, total rounds, score, and average time per drawing. Also includes a podium for the top 3 players.

- **CSS File:**
    - `style.css`: Stylesheet for the HTML files.

- **JavaScript Files:**
    - `index.js`: Controls the logic for the home page.
    - `game.js`: Handles the setup and initialization of game preferences selected by the user.
    - `clock_game.js`: Contains the script for the Clock game mode, handling the countdown timer and drawing validation.
    - `ai_game.js`: Contains the script for the AI game mode, managing the AI's drawing behavior and user interactions.
    - `end_game.js`: Manages the scoreboard and player performance display.
