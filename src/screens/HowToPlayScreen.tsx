"use client"

import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg"
import { useGame } from "../context/GameContext"
import { getSourceSerifFont } from "../styles/globalStyles"

const { width, height } = Dimensions.get("window")

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

const howToPlayCards = [
    {
        id: 0,
        title: "HOW TO PLAY",
        gradient: ["#4A90E2", "#8E44AD"], // Blue to purple (keep existing)
        content: "instructions",
    },
    {
        id: 1,
        title: "SPECIAL ELEMENTS",
        gradient: ["#4A90E2", "#1ABC9C"], // Blue to green gradient as shown in image
        content: "elements",
    },
    {
        id: 2,
        title: "START MISSION", // Changed from "START GAME" to "START MISSION"
        gradient: ["#8E44AD", "#E67E22"], // Purple to peach/orange gradient
        content: "start",
    },
]

// Origin data for the special elements slide
const originData = [
    {
        icon: require("../../assets/images/origin-icons/big-bang.png"),
        title: "The big",
        subtitle: "bang",
    },
    {
        icon: require("../../assets/images/origin-icons/low-mass-stars.png"),
        title: "Dying low",
        subtitle: "mass stars",
    },
    {
        icon: require("../../assets/images/origin-icons/white-dwarf-supernova.png"),
        title: "White dwarf",
        subtitle: "supernova",
    },
    {
        icon: require("../../assets/images/origin-icons/radioactive-decay.png"),
        title: "Radioactive",
        subtitle: "decay",
    },
    {
        icon: require("../../assets/images/origin-icons/cosmic-ray-fission.png"),
        title: "Cosmic ray",
        subtitle: "collision",
    },
    {
        icon: require("../../assets/images/origin-icons/high-mass-stars.png"),
        title: "Dying high-mass",
        subtitle: "stars",
    },
    {
        icon: require("../../assets/images/origin-icons/merging-neutron-stars.png"),
        title: "Merging",
        subtitle: "neutron stars",
    },
    {
        icon: require("../../assets/images/origin-icons/human-made.png"),
        title: "Human-made",
        subtitle: "",
    },
]

// Custom Selection Phase Icon Component
const SelectionPhaseIcon = () => {
    return (
        <View style={styles.selectionIconContainer}>
            <Svg width="30" height="30" style={styles.selectionSvg}>
                <Defs>
                    <SvgLinearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#4A90E2" />
                        <Stop offset="100%" stopColor="#8E44AD" />
                    </SvgLinearGradient>
                </Defs>
                <Rect
                    x="5"
                    y="5"
                    width="20"
                    height="20"
                    fill="url(#cardGradient)"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    rx="2"
                    style={{
                        filter: "drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.8))",
                    }}
                />
            </Svg>
        </View>
    )
}

export default function HowToPlayScreen() {
    const { backToMenu, startGame } = useGame()
    const [currentCard, setCurrentCard] = useState(0)

    const handleCardPress = (cardIndex: number) => {
        playSound(require("../../assets/sound/swipe_dynamic.wav"))
        setCurrentCard(cardIndex)
    }

    const handleSwipe = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX } = event.nativeEvent

            // More sensitive swipe detection (reduced from 50 to 30)
            if (translationX > 30) {
                playSound(require("../../assets/sound/swipe_dynamic.wav"))
                setCurrentCard((prev) => (prev > 0 ? prev - 1 : howToPlayCards.length - 1))
            } else if (translationX < -30) {
                playSound(require("../../assets/sound/swipe_dynamic.wav"))
                setCurrentCard((prev) => (prev < howToPlayCards.length - 1 ? prev + 1 : 0))
            }
        }
    }

    const handleStartMission = () => {
        playSound(require("../../assets/sound/start_game_button.wav"))
        startGame()
    }

    const renderInstructionsContent = () => (
        <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require("../../assets/images/icons/memoryicon.png")}
                        style={styles.instructionIcon}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.instructionTextContainer}>
                    <Text style={styles.instructionTitle}>Memorization Phase</Text>
                    <Text style={styles.instructionDescription}>
                        Six elements will glow on the periodic table for 5 seconds—pay close attention to their positions!
                    </Text>
                </View>
            </View>

            <View style={styles.instructionItem}>
                <View style={styles.iconContainer}>
                    <SelectionPhaseIcon />
                </View>
                <View style={styles.instructionTextContainer}>
                    <Text style={styles.instructionTitle}>Selection Phase</Text>
                    <Text style={styles.instructionDescription}>
                        After memorization, the elements will be hidden and one glowing position will be highlighted.
                    </Text>
                </View>
            </View>

            <View style={styles.instructionItem}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require("../../assets/images/icons/hourglass.png")}
                        style={styles.instructionIcon}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.instructionTextContainer}>
                    <Text style={styles.instructionTitle}>Time Pressure</Text>
                    <Text style={styles.instructionDescription}>
                        Choose correctly within 5 seconds for maximum mission success.
                    </Text>
                </View>
            </View>
        </View>
    )

    const renderElementsContent = () => (
        <View style={styles.elementsContainer}>
            {/* Left side - Origin icons grid */}
            <View style={styles.originIconsContainer}>
                <View style={styles.iconsGrid}>
                    {originData.map((item, index) => (
                        <View key={index} style={styles.iconItem}>
                            <Image source={item.icon} style={styles.iconImage} />
                            <Text style={styles.iconTitle}>{item.title}</Text>
                            {item.subtitle && <Text style={styles.iconSubtitle}>{item.subtitle}</Text>}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )

    const renderStartContent = () => (
        <View style={styles.startContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStartMission}>
                <Text style={styles.startButtonText}>START MISSION</Text>
            </TouchableOpacity>
        </View>
    )

    const renderCardContent = (card: (typeof howToPlayCards)[0]) => {
        switch (card.content) {
            case "instructions":
                return renderInstructionsContent()
            case "elements":
                return renderElementsContent()
            case "start":
                return renderStartContent()
            default:
                return null
        }
    }

    const getCollapsedStyle = (index: number) => {
        if (currentCard === 0) {
            // First screen: incremental heights (tallest to shortest)
            if (index === 0) return styles.collapsedCard1
            if (index === 1) return styles.collapsedCard2
            return styles.collapsedCard3
        } else if (currentCard === 1) {
            // Second screen: both rectangles same as second rectangle from first screen
            return styles.collapsedCard2 // Same as second rectangle from first screen
        } else {
            // Third screen: opposite direction (shortest to tallest)
            if (index === 0) return styles.collapsedCard3 // Shortest
            if (index === 1) return styles.collapsedCard2 // Medium
            return styles.collapsedCard1 // Tallest
        }
    }

    return (
        <View style={styles.container}>
            <PanGestureHandler onHandlerStateChange={handleSwipe}>
                <View style={styles.cardsContainer}>
                    {/* All cards positioned horizontally */}
                    {howToPlayCards.map((card, index) => {
                        const isActive = index === currentCard

                        const cardStyle = isActive ? styles.activeCard : getCollapsedStyle(index)

                        return (
                            <TouchableOpacity
                                key={card.id}
                                style={[styles.cardWrapper, cardStyle]}
                                onPress={() => handleCardPress(index)}
                                activeOpacity={1} // Disable highlighting when pressed
                            >
                                {isActive ? (
                                    <LinearGradient
                                        colors={card.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.expandedCard}
                                    >
                                        {card.content !== "start" && card.title && <Text style={styles.cardTitle}>{card.title}</Text>}
                                        {renderCardContent(card)}
                                    </LinearGradient>
                                ) : (
                                    <View
                                        style={[
                                            styles.collapsedCardContent,
                                            {
                                                backgroundColor:
                                                    currentCard === 1
                                                        ? "#666666" // Both rectangles on second screen use light gray
                                                        : index === 1
                                                            ? "#666666"
                                                            : index === 2
                                                                ? "#444444"
                                                                : "#333333",
                                            },
                                        ]}
                                    />
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </PanGestureHandler>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    cardsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 120,
    },
    cardWrapper: {
        marginHorizontal: 8,
    },
    activeCard: {
        width: width - 400,
        height: height * 0.8, // Increased from 0.7 to 0.8 (taller cards)
    },
    collapsedCard: {
        width: 70,
        height: height * 0.8, // Increased to match active card height
    },
    collapsedCard1: {
        width: 70,
        height: height * 0.7, // Increased proportionally
    },
    collapsedCard2: {
        width: 70,
        height: height * 0.6, // Increased proportionally
    },
    collapsedCard3: {
        width: 70,
        height: height * 0.5, // Increased proportionally
    },
    collapsedCardEqual: {
        width: 70,
        height: height * 0.65, // Increased proportionally
    },
    expandedCard: {
        flex: 1,
        borderRadius: 28,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
    },
    collapsedCardContent: {
        flex: 1,
        borderRadius: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "400", // Changed from "700" to "400" for regular weight
        fontFamily: getSourceSerifFont("regular"), // Changed from "bold" to "regular"
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 15,
        marginTop: 10,
        letterSpacing: 2,
    },
    instructionsContainer: {
        flex: 1,
        justifyContent: "space-evenly",
        paddingVertical: 0,
        paddingHorizontal: 15,
    },
    instructionItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 30,
        flexShrink: 0,
    },
    instructionIcon: {
        width: 24,
        height: 24,
        tintColor: "#000000",
    },
    selectionIconContainer: {
        position: "relative",
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    selectionSvg: {
        position: "relative",
        zIndex: 1,
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 10,
    },
    instructionTextContainer: {
        flex: 1,
        paddingRight: 5,
        paddingTop: 2,
    },
    instructionTitle: {
        fontSize: 14,
        fontWeight: "700", // Changed from "600" to "700" for bold
        fontFamily: getSourceSerifFont("bold"), // Changed from "semibold" to "bold"
        color: "#FFFFFF",
        marginBottom: 5,
        lineHeight: 16,
    },
    instructionDescription: {
        fontSize: 12,
        fontWeight: "400", // Explicitly set to regular weight
        fontFamily: getSourceSerifFont("regular"), // Explicitly set to regular
        color: "rgba(255, 255, 255, 0.95)",
        lineHeight: 16,
        flexWrap: "wrap",
    },
    elementsContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    originIconsContainer: {
        flex: 2,
        paddingRight: 20,
    },
    iconsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around", // Changed from space-between to space-around for more spacing
        paddingHorizontal: 10, // Added horizontal padding for more spacing
    },
    iconItem: {
        width: "20%", // Reduced from 22% to 20% to create more space between items
        alignItems: "center",
        marginBottom: 30, // Increased from 20 to 30 for more vertical spacing
        marginHorizontal: 5, // Added horizontal margin for more spacing
    },
    iconImage: {
        width: 32,
        height: 32,
        marginBottom: 6,
        resizeMode: "contain",
    },
    iconTitle: {
        fontSize: 10,
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "500",
        lineHeight: 12,
    },
    iconSubtitle: {
        fontSize: 10,
        fontFamily: getSourceSerifFont("regular"),
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "400",
        lineHeight: 12,
    },
    startContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    startButton: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 35,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    startButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
        letterSpacing: 1.5,
    },
})
