# Periodic Table Challenge

An interactive mobile game built with React Native and Expo to help users learn and memorize key elements from the periodic table.

## Purpose

This app is designed to teach and reinforce the positions of specific elements from the periodic table, inspired by the elements used in Mirragen Advanced Wound Care by Engineered Tissue Solutions. The main goal is to make memorization engaging and fun.

## Current Features (Core Game Logic)

- Memorization Phase – highlights 6 target elements for a short time.
- Recall Phase – hides targets and prompts you to tap their positions.
- Win/Lose States – tracks mistakes and celebrates success.
- Responsive Periodic Table – shows left/right halves with a toggle.
- Lanthanides & Actinides Rows – displayed correctly under main table.
- Centralized State Management – via React Context and reducer.


## Project Structure

```
src/
  components/
    ├─ ElementCell.tsx       # Renders a single element cell
    ├─ PeriodicTable.tsx     # Renders the grid and toggle logic
  context/
    ├─ GameContext.tsx       # Game state, reducer, actions
  data/
    ├─ elements.ts           # Periodic table data (typed with row/col)
  screens/
    ├─ GameScreen.tsx        # Main screen driving the game flow
App.tsx                      # Entry point, wraps provider
index.tsx                    # Expo bootstrap
```

## Tech Stack

- React Native (UI framework)
- Expo (build and development environment)
- TypeScript (type safety)
- React Context and useReducer (state management)

## How to Run

```bash
npm install
npx expo start
```

