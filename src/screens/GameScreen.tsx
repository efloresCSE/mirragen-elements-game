"use client"

import { useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import BurgerMenu from "../components/BurgerMenu"
import ElementCarousel from "../components/ElementCarousel"
import OriginPopup from "../components/OriginPopup"
import PeriodicTable from "../components/PeriodicTable"
import WheelIndicator from "../components/WheelIndicator"
import { useGame } from "../context/GameContext"
import { getSourceSerifFont } from "../styles/globalStyles"
import GameEndScreen from "./GameEndScreen"
import HowToPlayScreen from "./HowToPlayScreen"
import StartScreen from "./StartScreen"

export default function GameScreen() {
    const {
        gameState,
        tickTimer,
        tickRecallTimer,
        nextChoice,
        previousChoice,
        selectCurrentChoice,
        showOriginPopup,
        hideOriginPopup,
        showHowToPlay,
    } = useGame()

    // Countdown effect during memorize phase - simplified dependencies
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null

        if (gameState.phase === "memorize" && gameState.timeRemaining > 0 && !gameState.isPaused) {
            interval = setInterval(() => {
                tickTimer()
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameState.phase, gameState.timeRemaining, gameState.isPaused]) // Removed tickTimer dependency

    // Countdown effect during recall phase - simplified dependencies
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null

        if (gameState.phase === "recall" && gameState.recallTimeRemaining > 0 && !gameState.isPaused) {
            interval = setInterval(() => {
                tickRecallTimer()
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameState.phase, gameState.recallTimeRemaining, gameState.isPaused]) // Removed tickRecallTimer dependency

    // Show full screen components for menu and how to play
    if (gameState.phase === "menu") {
        return <StartScreen />
    }

    if (gameState.phase === "howToPlay") {
        return <HowToPlayScreen />
    }

    if (gameState.phase === "gameEnd") {
        return <GameEndScreen />
    }

    // Render progress circles (5 total, filled green for correct placements)
    const renderProgressCircles = () => {
        const circles = []
        for (let i = 0; i < 5; i++) {
            const isFilled = i < gameState.correctPlacements.length
            circles.push(
                <View
                    key={`progress-${i}`}
                    style={[
                        styles.circle,
                        isFilled ? styles.progressFilled : styles.circleEmpty
                    ]}
                />
            )
        }
        return circles
    }

    // Render mistake circles (3 total, filled red for mistakes)
    const renderMistakeCircles = () => {
        const circles = []
        for (let i = 0; i < 3; i++) {
            const isFilled = i < gameState.mistakes
            circles.push(
                <View
                    key={`mistake-${i}`}
                    style={[
                        styles.circle,
                        isFilled ? styles.mistakeFilled : styles.circleEmpty
                    ]}
                />
            )
        }
        return circles
    }

    // Show game layout for all other phases
    const renderGameContent = () => {
        switch (gameState.phase) {
            case "memorize":
                return (
                    <SafeAreaView style={styles.container}>
                        {/* Text overlay positioned in the empty space above the table */}
                        <View style={styles.memorizeOverlay}>
                            <Text style={styles.memorizeTitle}>MEMORIZE</Text>
                            <Text style={styles.memorizeTimer}>{gameState.timeRemaining}</Text>
                        </View>

                        {/* Use the same container structure as recall phase */}
                        <View style={styles.tableContainer}>
                            <PeriodicTable />
                        </View>

                        {/* Burger Menu */}
                        <BurgerMenu onPress={showOriginPopup} />

                        {/* Origin Popup */}
                        <OriginPopup
                            visible={gameState.showOriginPopup}
                            onClose={hideOriginPopup}
                            onHowToPlay={() => {
                                hideOriginPopup()
                                showHowToPlay()
                            }}
                        />
                    </SafeAreaView>
                )

            case "recall":
                return (
                    <SafeAreaView style={styles.container}>
                        {/* Center overlay with timer and circles */}
                        <View style={styles.centerOverlay}>
                            <View style={styles.timerSection}>
                                {/* Circles container on the left */}
                                <View style={styles.circlesContainer}>
                                    {/* Progress circles on top */}
                                    <View style={styles.progressCircles}>
                                        {renderProgressCircles()}
                                    </View>

                                    {/* Mistake circles on bottom */}
                                    <View style={styles.mistakeCircles}>
                                        {renderMistakeCircles()}
                                    </View>
                                </View>

                                {/* Timer on the right */}
                                <Text style={[styles.timer, gameState.recallTimeRemaining <= 10 ? styles.timerWarning : null]}>
                                    {gameState.recallTimeRemaining}
                                </Text>
                            </View>
                        </View>

                        {/* Use the same container structure as memorize phase */}
                        <View style={styles.tableContainer}>
                            <PeriodicTable />

                            {/* Element Carousel positioned absolutely on the right */}
                            <ElementCarousel
                                elements={gameState.availableChoices}
                                currentIndex={gameState.currentChoiceIndex}
                                onSelect={selectCurrentChoice}
                                onNext={nextChoice}
                                onPrevious={previousChoice}
                            />
                        </View>

                        {/* Wheel Indicator positioned relative to screen - moved outside tableContainer */}
                        <View style={styles.wheelIndicatorContainer}>
                            <WheelIndicator elements={gameState.availableChoices} currentIndex={gameState.currentChoiceIndex} />
                        </View>

                        {/* Burger Menu */}
                        <BurgerMenu onPress={showOriginPopup} />

                        {/* Origin Popup */}
                        <OriginPopup
                            visible={gameState.showOriginPopup}
                            onClose={hideOriginPopup}
                            onHowToPlay={() => {
                                hideOriginPopup()
                                showHowToPlay()
                            }}
                        />
                    </SafeAreaView>
                )

            default:
                return null
        }
    }

    return renderGameContent()
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    // Single shared container for both phases to ensure identical positioning
    tableContainer: {
        flex: 1,
        position: "relative",
    },
    memorizeOverlay: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 120, // Updated right margin to shift text a bit more left
        alignItems: "center", // Keep centered alignment
        zIndex: 10,
    },
    memorizeTitle: {
        fontSize: 18,
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
        letterSpacing: 2,
        marginBottom: 8,
    },
    memorizeTimer: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
        color: "#FFFFFF",
        textAlign: "center", // Keep center alignment
    },
    centerOverlay: {
        position: "absolute",
        top: 30, // Moved higher up
        left: 0,
        right: 120,
        alignItems: "center",
        zIndex: 10,
    },
    timerSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20, // Space between circles and timer
    },
    circlesContainer: {
        alignItems: "flex-start", // Align circles to the left
        gap: 8, // Space between progress and mistake rows
    },
    timer: {
        fontSize: 32, // Made timer larger since it's the main focus
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
        color: "#FFFFFF",
        textAlign: "center",
        minWidth: 60, // Ensure consistent width
    },
    timerWarning: {
        color: "#FF6B6B",
    },
    mistakeCircles: {
        flexDirection: "row",
        gap: 6, // Small gap between circles
    },
    progressCircles: {
        flexDirection: "row",
        gap: 6, // Small gap between circles
    },
    circle: {
        width: 8, // Reduced from 12 to 10
        height: 8, // Reduced from 12 to 10
        borderRadius: 4, // Reduced from 6 to 5
        borderWidth: 2,
    },
    circleEmpty: {
        borderColor: "#FFFFFF",
        backgroundColor: "transparent",
    },
    progressFilled: {
        borderColor: "#4CAF50",
        backgroundColor: "#4CAF50",
    },
    mistakeFilled: {
        borderColor: "#FF6B6B",
        backgroundColor: "#FF6B6B",
    },
    wheelIndicatorContainer: {
        position: "absolute",
        right: 10, // Now positioned relative to screen edge, can get much closer
        top: "50%",
        marginTop: -145, // Adjusted for the new height
        zIndex: 20,
    },
})
