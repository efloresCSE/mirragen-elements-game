"use client"

import { useEffect } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useGame } from "../context/GameContext"
import { getSourceSerifFont } from "../styles/globalStyles"

// Sound utility function with 50% volume
const playSound = async (soundFile: any) => {
    try {
        const { Audio } = await import("expo-av")

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        })

        const { sound } = await Audio.Sound.createAsync(soundFile)

        // Set volume to 50%
        await sound.setVolumeAsync(0.5)

        await sound.playAsync()

        // Clean up sound after playing
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync()
            }
        })
    } catch (error) {
        console.log("Error playing sound:", error)
    }
}

export default function GameEndScreen() {
    const { gameState, resetGame, showHowToPlay } = useGame()

    // Calculate percentage score
    const percentage = Math.round((gameState.correctPlacements.length / gameState.targetElements.length) * 100)

    // Calculate average response time
    const averageResponseTime =
        gameState.responseTimes.length > 0
            ? gameState.responseTimes.reduce((sum, time) => sum + time, 0) / gameState.responseTimes.length / 1000
            : 0

    // Determine mission status
    const isSuccess = percentage === 100
    const missionStatus = isSuccess ? "MISSION SUCCEEDED" : "MISSION FAILED"
    const statusColor = isSuccess ? "#4CAF50" : "#FF6B6B"

    // Play sound effect when screen loads
    useEffect(() => {
        const playSound = async () => {
            try {
                // Dynamically import expo-av to avoid module resolution issues
                const { Audio } = await import("expo-av")

                // Set audio mode for better compatibility
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                })

                const soundFile = isSuccess
                    ? require("../../assets/sound/game_complete.wav")
                    : require("../../assets/sound/game_over.wav")

                const { sound } = await Audio.Sound.createAsync(soundFile)

                // Set volume to 50%
                await sound.setVolumeAsync(0.5)

                await sound.playAsync()

                // Clean up sound after playing
                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        sound.unloadAsync()
                    }
                })
            } catch (error) {
                console.log("Error playing sound:", error)
                // Silently fail if audio doesn't work - game should still function
            }
        }

        // Add a small delay to ensure the screen is fully loaded
        const timer = setTimeout(() => {
            playSound()
        }, 500)

        return () => clearTimeout(timer)
    }, [isSuccess])

    // Handle play again button with sound
    const handlePlayAgain = () => {
        playSound(require("../../assets/sound/button_press_release.wav"))
        resetGame()
    }

    // Handle how to play button with sound
    const handleHowToPlay = () => {
        playSound(require("../../assets/sound/info_pop.wav"))
        showHowToPlay()
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Left side - Stats */}
                <View style={styles.statsSection}>
                    <Text style={[styles.missionStatus, { color: statusColor }]}>{missionStatus}</Text>
                    <Text style={styles.percentage} numberOfLines={1} adjustsFontSizeToFit={true}>
                        {percentage}%
                    </Text>
                    <View style={styles.responseTimeContainer}>
                        <Text style={styles.responseTime}>{averageResponseTime.toFixed(1)} sec</Text>
                        <Text style={styles.responseLabel}>Avg Response</Text>
                        <Text style={styles.responseLabel}>Time</Text>
                    </View>
                </View>

                {/* Vertical line separator - slightly less thick and tall */}
                <View style={styles.separator} />

                {/* Center - Elements list positioned closer to left */}
                <View style={styles.elementsSection}>
                    {gameState.targetElements.map((element) => {
                        const isCorrect = gameState.correctPlacements.includes(element.atomicNumber)
                        return (
                            <View key={element.atomicNumber} style={styles.elementRow}>
                                <View style={[styles.elementSymbol, { borderColor: isCorrect ? "#4CAF50" : "#FFFFFF" }]}>
                                    <Text style={[styles.symbolText, { color: isCorrect ? "#4CAF50" : "#FFFFFF" }]}>
                                        {element.symbol}
                                    </Text>
                                </View>
                                <Text style={[styles.elementName, { color: isCorrect ? "#4CAF50" : "#FFFFFF" }]}>{element.name}</Text>
                            </View>
                        )
                    })}
                </View>

                {/* Right side - Buttons */}
                <View style={styles.buttonsSection}>
                    <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
                        <Text style={styles.playAgainText}>PLAY AGAIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.howToPlayButton} onPress={handleHowToPlay}>
                        <Text style={styles.howToPlayText}>HOW TO PLAY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 60,
        paddingRight: 40, // Reduced from 80 to 40
        maxWidth: 900,
        width: "100%",
    },
    statsSection: {
        flex: 1,
        alignItems: "center",
        paddingRight: 0, // Changed from 5 to 0
        minWidth: 150,
    },
    missionStatus: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        letterSpacing: 1,
        marginBottom: 12,
        textAlign: "center",
    },
    percentage: {
        fontSize: 72,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
        color: "#FFFFFF",
        marginBottom: 20,
        textAlign: "center",
        width: "100%",
        minWidth: 120,
    },
    responseTimeContainer: {
        alignItems: "center",
    },
    responseTime: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
        color: "#FFFFFF",
        marginBottom: 4,
        textAlign: "center",
        numberOfLines: 1,
    },
    responseLabel: {
        fontSize: 12,
        fontFamily: getSourceSerifFont("regular"),
        color: "#999999",
        lineHeight: 14,
        textAlign: "center",
    },
    separator: {
        width: 2,
        height: 240,
        backgroundColor: "#FFFFFF",
        marginLeft: 10, // Reduced space between stats and separator
        marginRight: 20, // Keep original space between separator and elements
    },
    elementsSection: {
        flex: 1.2,
        paddingHorizontal: 5, // Keep this the same
        alignItems: "flex-start",
    },
    elementRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    elementSymbol: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    symbolText: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
    },
    elementName: {
        fontSize: 16,
        fontWeight: "400",
        fontFamily: getSourceSerifFont("regular"),
    },
    buttonsSection: {
        flex: 0.8,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 40,
    },
    playAgainButton: {
        borderWidth: 1,
        borderColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        marginBottom: 16,
        minWidth: 140,
        alignItems: "center",
    },
    playAgainText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "500",
        fontFamily: getSourceSerifFont("semibold"),
        letterSpacing: 1,
        textAlign: "center",
        numberOfLines: 1,
    },
    howToPlayButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        minWidth: 140,
        alignItems: "center",
    },
    howToPlayText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "400",
        fontFamily: getSourceSerifFont("regular"),
        letterSpacing: 1,
        textDecorationLine: "underline",
        textAlign: "center",
        numberOfLines: 1,
    },
})
