export interface Element {
    symbol: string
    name: string
    atomicNumber: number
    row: number
    col: number
    group?: string
}

export interface GameState {
    phase: "start" | "memorize" | "recall" | "win" | "lose"
    targetElements: Element[]
    currentElementIndex: number
    correctPlacements: number[]
    mistakes: number
    maxMistakes: number
    timeRemaining: number
}

export interface GameContextType {
    gameState: GameState
    startGame: () => void
    selectElement: (atomicNumber: number) => void
    resetGame: () => void
    tickTimer: () => void
}
