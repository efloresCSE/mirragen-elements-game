export interface Element {
    symbol: string
    name: string
    atomicNumber: number
    row: number
    col: number
    group?: string
    description?: string
    color?: string
}

export interface GameState {
    phase: "menu" | "howToPlay" | "memorize" | "recall" | "gameEnd"
    targetElements: Element[]
    currentElementIndex: number
    currentHighlightedPosition: { row: number; col: number } | null
    correctPlacements: number[]
    mistakes: number
    maxMistakes: number
    timeRemaining: number
    recallTimeRemaining: number
    availableChoices: Element[]
    currentChoiceIndex: number
    responseTimes: number[]
    currentElementStartTime: number
    showOriginPopup: boolean
    isPaused: boolean
}

export interface GameContextType {
    gameState: GameState
    startGame: () => void
    showHowToPlay: () => void
    backToMenu: () => void
    selectElement: (atomicNumber: number) => void
    nextChoice: () => void
    previousChoice: () => void
    selectCurrentChoice: () => void
    resetGame: () => void
    tickTimer: () => void
    tickRecallTimer: () => void
    showOriginPopup: () => void
    hideOriginPopup: () => void
}
