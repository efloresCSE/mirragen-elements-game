"use client"

import * as Haptics from "expo-haptics"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import { PERIODIC_TABLE_DATA, TARGET_ELEMENTS } from "../data/elements"
import type { GameContextType, GameState } from "../types/game"
import { playSound } from "../utils/audio"

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const initialState: GameState = {
  phase: "menu",
  targetElements: PERIODIC_TABLE_DATA.filter((el) => TARGET_ELEMENTS.includes(el.atomicNumber)),
  currentElementIndex: 0,
  currentHighlightedPosition: null,
  correctPlacements: [],
  mistakes: 0,
  maxMistakes: 3,
  timeRemaining: 5,
  recallTimeRemaining: 30,
  availableChoices: [],
  currentChoiceIndex: 0,
  responseTimes: [],
  currentElementStartTime: 0,
  showOriginPopup: false,
  isPaused: false,
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "SHOW_HOW_TO_PLAY" }
  | { type: "BACK_TO_MENU" }
  | { type: "START_RECALL" }
  | { type: "CORRECT_PLACEMENT"; atomicNumber: number }
  | { type: "WRONG_PLACEMENT" }
  | { type: "NEXT_CHOICE" }
  | { type: "PREVIOUS_CHOICE" }
  | { type: "SELECT_CURRENT_CHOICE" }
  | { type: "RESET_GAME" }
  | { type: "TICK_TIMER" }
  | { type: "TICK_RECALL_TIMER" }
  | { type: "SHOW_ORIGIN_POPUP" }
  | { type: "HIDE_ORIGIN_POPUP" }

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const shuffledTargets = shuffleArray(
        PERIODIC_TABLE_DATA.filter((el) => TARGET_ELEMENTS.includes(el.atomicNumber)),
      )
      return {
        ...state,
        phase: "memorize",
        timeRemaining: 5,
        recallTimeRemaining: 30,
        targetElements: shuffledTargets,
        currentElementIndex: 0,
        correctPlacements: [],
        mistakes: 0,
        currentHighlightedPosition: null,
        availableChoices: [],
        currentChoiceIndex: 0,
        responseTimes: [],
        currentElementStartTime: 0,
        showOriginPopup: false,
        isPaused: false,
      }
    }

    case "SHOW_HOW_TO_PLAY":
      return {
        ...state,
        phase: "howToPlay",
        showOriginPopup: false,
      }

    case "BACK_TO_MENU":
      return {
        ...initialState,
        phase: "menu",
      }

    case "SHOW_ORIGIN_POPUP":
      return {
        ...state,
        showOriginPopup: true,
        isPaused: true,
      }

    case "HIDE_ORIGIN_POPUP":
      return {
        ...state,
        showOriginPopup: false,
        isPaused: false,
      }

    case "TICK_TIMER": {
      if (state.isPaused) return state

      const newTime = state.timeRemaining - 1
      if (newTime <= 0 && state.phase === "memorize") {
        const currentTarget = state.targetElements[0]
        const allChoices = shuffleArray([...state.targetElements])

        return {
          ...state,
          phase: "recall",
          currentHighlightedPosition: { row: currentTarget.row, col: currentTarget.col },
          availableChoices: allChoices,
          currentChoiceIndex: 0,
          currentElementStartTime: Date.now(),
        }
      }
      return {
        ...state,
        timeRemaining: newTime,
      }
    }

    case "TICK_RECALL_TIMER": {
      if (state.isPaused) return state

      const newRecallTime = state.recallTimeRemaining - 1
      const isTimeUp = newRecallTime <= 0
      return {
        ...state,
        recallTimeRemaining: Math.max(0, newRecallTime),
        phase: isTimeUp ? "gameEnd" : state.phase,
      }
    }

    case "NEXT_CHOICE": {
      return {
        ...state,
        currentChoiceIndex: (state.currentChoiceIndex + 1) % state.availableChoices.length,
        isPaused: false,
      }
    }

    case "PREVIOUS_CHOICE": {
      return {
        ...state,
        currentChoiceIndex:
          state.currentChoiceIndex === 0 ? state.availableChoices.length - 1 : state.currentChoiceIndex - 1,
        isPaused: false,
      }
    }

    case "SELECT_CURRENT_CHOICE": {
      const selectedElement = state.availableChoices[state.currentChoiceIndex]
      const currentTarget = state.targetElements[state.currentElementIndex]
      const responseTime = Date.now() - state.currentElementStartTime

      if (selectedElement.atomicNumber === currentTarget.atomicNumber) {
        playSound(require("../../assets/sound/button_press_release.wav"))

        const newCorrectPlacements = [...state.correctPlacements, selectedElement.atomicNumber]
        const newResponseTimes = [...state.responseTimes, responseTime]
        const isGameWon = newCorrectPlacements.length === state.targetElements.length

        if (isGameWon) {
          return {
            ...state,
            correctPlacements: newCorrectPlacements,
            responseTimes: newResponseTimes,
            phase: "gameEnd",
          }
        } else {
          const nextElementIndex = state.currentElementIndex + 1
          const nextTarget = state.targetElements[nextElementIndex]

          const remainingChoices = state.availableChoices.filter(
            (choice) => choice.atomicNumber !== selectedElement.atomicNumber,
          )

          const newChoiceIndex = state.currentChoiceIndex >= remainingChoices.length ? 0 : state.currentChoiceIndex

          return {
            ...state,
            correctPlacements: newCorrectPlacements,
            responseTimes: newResponseTimes,
            currentElementIndex: nextElementIndex,
            currentHighlightedPosition: { row: nextTarget.row, col: nextTarget.col },
            availableChoices: remainingChoices,
            currentChoiceIndex: newChoiceIndex,
            currentElementStartTime: Date.now(),
          }
        }
      } else {
        playSound(require("../../assets/sound/button_press_release_large.wav"))
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

        const newResponseTimes = [...state.responseTimes, responseTime]
        const newMistakes = state.mistakes + 1
        const isGameLost = newMistakes >= state.maxMistakes
        return {
          ...state,
          mistakes: newMistakes,
          responseTimes: newResponseTimes,
          phase: isGameLost ? "gameEnd" : "recall",
          currentElementStartTime: Date.now(),
        }
      }
    }

    case "RESET_GAME":
      return { ...initialState, phase: "menu" }

    default:
      return state
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState)

  const startGame = () => dispatch({ type: "START_GAME" })
  const showHowToPlay = () => dispatch({ type: "SHOW_HOW_TO_PLAY" })
  const backToMenu = () => dispatch({ type: "BACK_TO_MENU" })
  const selectElement = (atomicNumber: number) => {}
  const nextChoice = () => dispatch({ type: "NEXT_CHOICE" })
  const previousChoice = () => dispatch({ type: "PREVIOUS_CHOICE" })
  const selectCurrentChoice = () => dispatch({ type: "SELECT_CURRENT_CHOICE" })
  const resetGame = () => dispatch({ type: "RESET_GAME" })
  const tickTimer = () => dispatch({ type: "TICK_TIMER" })
  const tickRecallTimer = () => dispatch({ type: "TICK_RECALL_TIMER" })
  const showOriginPopup = () => dispatch({ type: "SHOW_ORIGIN_POPUP" })
  const hideOriginPopup = () => dispatch({ type: "HIDE_ORIGIN_POPUP" })

  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        showHowToPlay,
        backToMenu,
        selectElement,
        nextChoice,
        previousChoice,
        selectCurrentChoice,
        resetGame,
        tickTimer,
        tickRecallTimer,
        showOriginPopup,
        hideOriginPopup,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within GameProvider")
  }
  return context
}
