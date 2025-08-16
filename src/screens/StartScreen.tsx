"use client"

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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

export default function StartScreen() {
    const { startGame, showHowToPlay } = useGame()

    const handleStartGame = () => {
        playSound(require("../../assets/sound/start_game_button.wav"))
        startGame()
    }

    const handleHowToPlay = () => {
        playSound(require("../../assets/sound/info_pop.wav"))
        showHowToPlay()
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* ETS Logo */}
                <Image source={require("../../assets/images/ETS-logo.png")} style={styles.logo} resizeMode="contain" />

                <Text style={styles.title}>ORIGINS OF THE</Text>
                <Text style={styles.title}>ELEMENTS</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.playButton} onPress={handleStartGame}>
                        <Text style={styles.playButtonText}>START MISSION</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.howToPlayButton} onPress={handleHowToPlay}>
                        <Text style={styles.howToPlayButtonText}>HOW TO PLAY</Text>
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
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "300",
        fontFamily: getSourceSerifFont("regular"),
        color: "#FFFFFF",
        textAlign: "center",
        letterSpacing: 2,
        marginBottom: 4,
    },
    buttonContainer: {
        marginTop: 60,
        alignItems: "center",
    },
    playButton: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderWidth: 1,
        borderColor: "#D4AF37",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 4,
        marginBottom: 30,
        minWidth: 160,
        alignItems: "center",
        shadowColor: "#D4AF37",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 15,
    },
    playButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        letterSpacing: 1,
    },
    howToPlayButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
    },
    howToPlayButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "400",
        fontFamily: getSourceSerifFont("regular"),
        letterSpacing: 1,
        textDecorationLine: "underline",
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 30,
    },
})
