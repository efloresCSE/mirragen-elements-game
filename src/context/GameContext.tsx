"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { PERIODIC_TABLE_DATA, TARGET_ELEMENTS } from "../data/elements"
import type { GameContextType, GameState } from "../types/game"

// utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

const initialState: GameState = {
    phase: "start",
    targetElements: PERIODIC_TABLE_DATA.filter((el) => TARGET_ELEMENTS.includes(el.atomicNumber)),
    currentElementIndex: 0,
    correctPlacements: [],
    mistakes: 0,
    maxMistakes: 3,
    timeRemaining: 5,
}

type GameAction =
    | { type: "START_GAME" }
    | { type: "START_RECALL" }
    | { type: "CORRECT_PLACEMENT"; atomicNumber: number }
    | { type: "WRONG_PLACEMENT" }
    | { type: "RESET_GAME" }
    | { type: "TICK_TIMER" }

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
                targetElements: shuffledTargets,
                currentElementIndex: 0,
                correctPlacements: [],
                mistakes: 0,
            }
        }

        case "CORRECT_PLACEMENT": {
            const newCorrectPlacements = [...state.correctPlacements, action.atomicNumber]
            const isGameWon = newCorrectPlacements.length === state.targetElements.length
            return {
                ...state,
                correctPlacements: newCorrectPlacements,
                phase: isGameWon ? "win" : "recall",
                currentElementIndex: isGameWon ? state.currentElementIndex : state.currentElementIndex + 1,
            }
        }

        case "WRONG_PLACEMENT": {
            const newMistakes = state.mistakes + 1
            const isGameLost = newMistakes >= state.maxMistakes
            return {
                ...state,
                mistakes: newMistakes,
                phase: isGameLost ? "lose" : "recall",
            }
        }

        case "RESET_GAME":
            return { ...initialState }

        case "TICK_TIMER": {
            const newTime = state.timeRemaining - 1
            return {
                ...state,
                timeRemaining: newTime,
                phase: newTime <= 0 && state.phase === "memorize" ? "recall" : state.phase,
            }
        }

        default:
            return state
    }
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameState, dispatch] = useReducer(gameReducer, initialState)

    const startGame = () => dispatch({ type: "START_GAME" })
    const selectElement = (atomicNumber: number) => {
        const currentTarget = gameState.targetElements[gameState.currentElementIndex]
        if (currentTarget && currentTarget.atomicNumber === atomicNumber) {
            dispatch({ type: "CORRECT_PLACEMENT", atomicNumber })
        } else {
            dispatch({ type: "WRONG_PLACEMENT" })
        }
    }
    const resetGame = () => dispatch({ type: "RESET_GAME" })
    const tickTimer = () => dispatch({ type: "TICK_TIMER" })

    return (
        <GameContext.Provider value={{ gameState, startGame, selectElement, resetGame, tickTimer }}>
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
