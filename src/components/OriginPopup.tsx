"use client"

import { BlurView } from "expo-blur"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getSourceSerifFont } from "../styles/globalStyles"

interface OriginPopupProps {
    visible: boolean
    onClose: () => void
    onHowToPlay: () => void
}

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

export default function OriginPopup({ visible, onClose, onHowToPlay }: OriginPopupProps) {
    const [showReferences, setShowReferences] = useState(false)
    const [wasVisible, setWasVisible] = useState(false)

    // Reset showReferences when popup becomes visible and play opening sound
    useEffect(() => {
        if (visible && !wasVisible) {
            // Popup is opening
            setShowReferences(false)
            playSound(require("../../assets/sound/info_pop.wav"))
            setWasVisible(true)
        } else if (!visible && wasVisible) {
            // Popup is closing
            setWasVisible(false)
        }
    }, [visible, wasVisible])

    // Handle close with sound
    const handleClose = () => {
        playSound(require("../../assets/sound/info_pop_scifi.wav"))
        onClose()
    }

    // Handle back button with sound
    const handleBackButton = () => {
        playSound(require("../../assets/sound/info_pop_scifi.wav"))
        onClose()
    }

    // Handle info button click (no sound needed as it's internal navigation)
    const handleInfoClick = () => {
        setShowReferences(true)
    }

    // Handle back to main from references (no sound needed as it's internal navigation)
    const handleBackToMain = () => {
        setShowReferences(false)
    }

    // Handle how to play button with sound
    const handleHowToPlay = () => {
        playSound(require("../../assets/sound/info_pop.wav"))
        onHowToPlay()
    }

    if (!visible) return null

    return (
        <TouchableOpacity style={styles.overlay} onPress={handleClose} activeOpacity={1}>
            <View style={styles.popupContainer}>
                <BlurView intensity={20} tint="dark" style={styles.popup}>
                    {/* Header with back button, title, and info icon */}
                    {!showReferences ? (
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
                                <Text style={styles.backButtonText}>BACK</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Origins of the Elements</Text>
                            <TouchableOpacity style={styles.infoButton} onPress={handleInfoClick}>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoIconText}>i</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.referencesHeader}>
                            <Text style={styles.referencesTitle}>References</Text>
                        </View>
                    )}

                    {!showReferences ? (
                        <>
                            <View style={styles.iconsGrid}>
                                {originData.map((item, index) => (
                                    <View key={index} style={styles.iconItem}>
                                        <Image source={item.icon} style={styles.iconImage} />
                                        <Text style={styles.iconTitle}>{item.title}</Text>
                                        {item.subtitle && <Text style={styles.iconSubtitle}>{item.subtitle}</Text>}
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.howToPlayButton} onPress={handleHowToPlay}>
                                <Text style={styles.howToPlayText}>HOW TO PLAY</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.referencesContainer}>
                                <Text style={styles.referenceItem}>
                                    1. Lansdown, Alan. Calcium: a potential central regulator in wound healing in the skin. Wound Repair
                                    and Regeneration, 2002.
                                </Text>
                                <Text style={styles.referenceItem}>
                                    2. Demidov-Orlov, M., et al. Action of Boron at the Molecular Level. Biological Trace Element
                                    Research, 2019.
                                </Text>
                                <Text style={styles.referenceItem}>
                                    3. Coger, Vincent, et al. Tissue Concentrations of Zinc, Iron, Copper and Magnesium During the Phases
                                    of Wound Healing in a Rodent Model. Biological Trace Element Research, 2019.
                                </Text>
                                <Text style={styles.referenceItem}>
                                    4. Wick, Nicola, et al. The role of sodium in modulating immune cell function. Nature, 2019.
                                </Text>
                                <Text style={styles.referenceItem}>
                                    5. O'Grady, Sean M., et al. Molecular Diversity and Function of voltage-gated potassium channels in
                                    epithelial cells. International Journal of Biochemistry and Cell Biology, 2008.
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.backToMainButton} onPress={handleBackToMain}>
                                <Text style={styles.backToMainText}>BACK</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </BlurView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    popupContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 60,
    },
    popup: {
        borderRadius: 12,
        padding: 24,
        width: "65%",
        maxWidth: 480,
        borderWidth: 1, // Increased border width
        borderColor: "#FFFFFF", // Bright white border
        overflow: "hidden", // Added to ensure the blur effect works properly
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    backButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    backButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "500",
        fontFamily: getSourceSerifFont("semibold"),
        letterSpacing: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
        textAlign: "center",
        letterSpacing: 1,
        flex: 1,
    },
    spacer: {
        width: 60,
    },
    iconsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    iconItem: {
        width: "22%",
        alignItems: "center",
        marginBottom: 20,
    },
    iconImage: {
        width: 36,
        height: 36,
        marginBottom: 6,
        resizeMode: "contain",
    },
    iconTitle: {
        fontSize: 11,
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "500",
        lineHeight: 13,
    },
    iconSubtitle: {
        fontSize: 11,
        fontFamily: getSourceSerifFont("regular"),
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "400",
        lineHeight: 13,
    },
    howToPlayButton: {
        alignSelf: "center",
        paddingVertical: 8,
    },
    howToPlayText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "400",
        fontFamily: getSourceSerifFont("regular"),
        letterSpacing: 1,
        textDecorationLine: "underline",
    },
    infoButton: {
        width: 60,
        alignItems: "flex-end",
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    infoIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    infoIconText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "400",
        fontFamily: getSourceSerifFont("regular"),
        fontStyle: "italic",
    },
    referencesContainer: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    referenceItem: {
        fontSize: 9, // Reduced from 10 to 9
        fontFamily: getSourceSerifFont("regular"),
        color: "#FFFFFF",
        lineHeight: 12, // Reduced from 14 to 12
        marginBottom: 10, // Reduced from 12 to 10
        textAlign: "center",
        paddingHorizontal: 10,
    },
    backToMainButton: {
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    backToMainText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "500",
        fontFamily: getSourceSerifFont("semibold"),
        letterSpacing: 1,
        textDecorationLine: "underline", // Added underline
    },
    referencesHeader: {
        alignItems: "center",
        marginBottom: 24,
    },
    referencesTitle: {
        fontSize: 20,
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
        textAlign: "center",
        letterSpacing: 1,
    },
})
