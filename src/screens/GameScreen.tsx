"use client"

import { useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import PeriodicTable from "../components/PeriodicTable"
import { useGame } from "../context/GameContext"

export default function GameScreen() {
    const { gameState, startGame, resetGame, tickTimer } = useGame()

    // Countdown effect during memorize phase
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null

        if (gameState.phase === "memorize" && gameState.timeRemaining > 0) {
            interval = setInterval(() => {
                tickTimer()
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameState.phase, gameState.timeRemaining, tickTimer])

    const renderPhaseContent = () => {
        switch (gameState.phase) {
            case "start":
                return (
                    <View style={styles.phaseContainer}>
                        <Text style={styles.title}>Periodic Table Challenge</Text>
                        <Text style={styles.instructions}>Study the 6 highlighted elements. When you are ready, press Start.</Text>
                        <TouchableOpacity style={styles.button} onPress={startGame}>
                            <Text style={styles.buttonText}>Start Game</Text>
                        </TouchableOpacity>
                    </View>
                )

            case "memorize":
                return (
                    <View style={styles.phaseContainer}>
                        <Text style={styles.title}>Memorize These Elements</Text>
                        <Text style={styles.timer}>Time: {gameState.timeRemaining}s</Text>
                    </View>
                )

            case "recall":
                const currentElement = gameState.targetElements[gameState.currentElementIndex]
                return (
                    <View style={styles.phaseContainer}>
                        <Text style={styles.title}>
                            Find: {currentElement?.name} ({currentElement?.symbol})
                        </Text>
                        <Text style={styles.progress}>
                            Progress: {gameState.correctPlacements.length}/{gameState.targetElements.length}
                        </Text>
                        <Text style={styles.mistakes}>
                            Mistakes: {gameState.mistakes}/{gameState.maxMistakes}
                        </Text>
                    </View>
                )

            case "win":
                return (
                    <View style={styles.phaseContainer}>
                        <Text style={styles.title}>🎉 Congratulations!</Text>
                        <Text style={styles.subtitle}>You remembered them all!</Text>
                        <TouchableOpacity style={styles.button} onPress={resetGame}>
                            <Text style={styles.buttonText}>Play Again</Text>
                        </TouchableOpacity>
                    </View>
                )

            case "lose":
                return (
                    <View style={styles.phaseContainer}>
                        <Text style={styles.title}>❌ Game Over</Text>
                        <Text style={styles.subtitle}>Try again!</Text>
                        <TouchableOpacity style={styles.button} onPress={resetGame}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )

            default:
                return null
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderPhaseContent()}
            <PeriodicTable />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    phaseContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: "center",
        minHeight: 120, // Ensure consistent height
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: "center",
    },
    instructions: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 15,
        paddingHorizontal: 10,
        lineHeight: 20,
    },
    timer: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF5722",
    },
    progress: {
        fontSize: 14,
        marginBottom: 4,
    },
    mistakes: {
        fontSize: 14,
        color: "#F44336",
    },
    button: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
})
