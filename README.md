# Periodic Table Challenge

An interactive mobile game built with React Native and Expo to help users learn and memorize key elements from the periodic table.

## Purpose

This app is designed to teach and reinforce the positions of specific elements from the periodic table, inspired by the elements used in Mirragen Advanced Wound Care by Engineered Tissue Solutions. The main goal is to make memorization engaging and fun.

## Current Features (Core Game Logic)

- **Memorization Phase** – highlights target elements for a short time
- **Recall Phase** – hides targets and prompts you to select correct elements from carousel
- **Element Carousel** – swipe through element choices with visual indicators
- **Win/Lose States** – tracks mistakes and celebrates success
- **Responsive Design** – optimized for both phones and tablets in landscape
- **Audio Feedback** – sound effects for interactions and game events
- **Element Origins** – visual icons showing cosmic origins of each element
- **How to Play Guide** – interactive tutorial with swipeable cards
- **Centralized State Management** – via React Context and reducer

## Project Structure

```text
src/
├── components/
│   ├── BurgerMenu.tsx           # Menu button with safe area handling
│   ├── ElementCard.tsx          # Detailed element card for carousel
│   ├── ElementCarousel.tsx      # Swipeable element selection interface
│   ├── ElementCell.tsx          # Individual periodic table cell
│   ├── OriginPopup.tsx          # Modal showing element origins
│   ├── PeriodicTable.tsx        # Complete periodic table with borders
│   └── WheelIndicator.tsx       # Visual carousel position indicator
├── context/
│   └── GameContext.tsx          # Game state, reducer, actions
├── data/
│   └── elements.ts              # Complete periodic table data (118 elements)
├── hooks/
│   └── useDeviceType.ts         # Device detection (phone/tablet)
├── screens/
│   ├── GameEndScreen.tsx        # Results and statistics screen
│   ├── GameScreen.tsx           # Main game coordinator
│   ├── HowToPlayScreen.tsx      # Interactive tutorial
│   └── StartScreen.tsx          # Main menu screen
├── styles/
│   ├── globalStyles.ts          # Font utilities and global styles
│   └── theme.ts                 # Responsive design tokens
├── types/
│   └── game.ts                  # TypeScript interfaces
└── utils/
    ├── assets.ts                # Asset preloading utilities
    ├── audio.ts                 # Sound management system
    └── elements.ts              # Element data utilities

app/
├── _layout.tsx                  # Expo Router layout
└── page.tsx                     # Main page component

App.tsx                          # Entry point with providers
index.tsx                        # Expo bootstrap
```

## Tech Stack

- **React Native** (UI framework)
- **Expo** (build and development environment)
- **TypeScript** (type safety)
- **React Context and useReducer** (state management)
- **Expo Audio** (sound effects)
- **React Native Gesture Handler** (swipe interactions)
- **React Native SVG** (custom graphics and borders)
- **Expo Blur** (visual effects)

## How to Run

```bash
npm install
npx expo start
```

## Game Flow

1. **Start Screen** – Main menu with play and tutorial options
2. **How to Play** – Interactive tutorial explaining game mechanics
3. **Memorization Phase** – 5 seconds to memorize highlighted elements
4. **Recall Phase** – Select correct elements from carousel within time limit
5. **Game End** – View results, statistics, and play again

## Key Components Explained

### Game Management
- **GameContext.tsx** – Centralized state management with reducer pattern
- **GameScreen.tsx** – Orchestrates game phases and UI transitions

### Periodic Table
- **PeriodicTable.tsx** – Renders complete 118-element table with custom SVG borders
- **ElementCell.tsx** – Individual cells with origin icons and responsive sizing

### Element Selection
- **ElementCarousel.tsx** – Horizontal swipeable element browser
- **ElementCard.tsx** – Detailed element information cards
- **WheelIndicator.tsx** – Visual position indicator for carousel

### User Interface
- **OriginPopup.tsx** – Educational modal about element cosmic origins
- **HowToPlayScreen.tsx** – Multi-card tutorial with gesture navigation
- **BurgerMenu.tsx** – Accessible menu button with safe area support

### Utilities
- **audio.ts** – Preloading, throttling, and volume management for sound effects
- **theme.ts** – Responsive design tokens that adapt to device type
- **elements.ts** – Element data processing and origin icon mapping
