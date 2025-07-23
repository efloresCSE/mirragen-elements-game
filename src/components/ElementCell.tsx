import { StyleSheet, Text, TouchableOpacity } from "react-native"
import type { Element } from "../types/game"

interface ElementCellProps {
    element: Element | null
    isTarget: boolean
    isCorrect: boolean
    isCurrentTarget: boolean
    gamePhase: string
    onPress: () => void
    cellSize?: number
}

export default function ElementCell({
    element,
    isTarget,
    isCorrect,
    gamePhase,
    onPress,
    cellSize = 40,
}: ElementCellProps) {
    if (!element) {
        return <TouchableOpacity style={[styles.cell, styles.empty, { width: cellSize, height: cellSize }]} disabled />
    }

    const getBackgroundColor = () => {
        if (isCorrect) return "#4CAF50" // green for correct
        // highlight targets during memorize/start
        if (isTarget && (gamePhase === "memorize" || gamePhase === "start")) return "#2196F3"
        // hide targets during recall
        if (isTarget && gamePhase === "recall") return "#E0E0E0"
        return "#F5F5F5" // default
    }

    const showSymbol = () => {
        if (gamePhase === "start" || gamePhase === "memorize") return true
        if (gamePhase === "recall" && !isTarget) return true
        if (gamePhase === "recall" && isCorrect) return true
        if (gamePhase === "win" || gamePhase === "lose") return true
        return false
    }

    // Scale font sizes based on cell size
    const atomicNumberFontSize = Math.max(6, cellSize * 0.15)
    const symbolFontSize = Math.max(8, cellSize * 0.25)

    return (
        <TouchableOpacity
            style={[
                styles.cell,
                {
                    backgroundColor: getBackgroundColor(),
                    width: cellSize,
                    height: cellSize,
                },
            ]}
            onPress={onPress}
            disabled={gamePhase !== "recall" || !isTarget || isCorrect}
        >
            <Text style={[styles.atomicNumber, { fontSize: atomicNumberFontSize }]}>{element.atomicNumber}</Text>
            {showSymbol() && <Text style={[styles.symbol, { fontSize: symbolFontSize }]}>{element.symbol}</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cell: {
        margin: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#DDD",
    },
    empty: {
        backgroundColor: "transparent",
        borderColor: "transparent",
    },
    atomicNumber: {
        color: "#666",
        position: "absolute",
        top: 2,
        left: 2,
        fontWeight: "500",
    },
    symbol: {
        fontWeight: "bold",
        color: "#333",
    },
})
