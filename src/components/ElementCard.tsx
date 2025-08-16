"use client"

import { BlurView } from "expo-blur"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getSourceSerifFont } from "../styles/globalStyles"
import type { Element } from "../types/game"

interface ElementCardProps {
    element: Element
    onSelect: () => void
    onNext: () => void
    onPrevious: () => void
    currentIndex: number
    totalCount: number
    isActive?: boolean
    isPreview?: boolean
}

// Complete origin icons mapping based on the reference image
const getOriginIcons = (atomicNumber: number): string[] => {
    const iconMap: { [key: number]: string[] } = {
        // Row 1 - Big Bang
        1: ["big-bang"], // H
        2: ["big-bang"], // He
        // Row 2
        3: ["low-mass-stars"], // Li
        4: ["cosmic-ray-fission"], // Be
        5: ["cosmic-ray-fission"], // B
        6: ["low-mass-stars"], // C
        7: ["low-mass-stars"], // N
        8: ["high-mass-stars"], // O
        9: ["high-mass-stars"], // F
        10: ["high-mass-stars"], // Ne
        // Row 3
        11: ["high-mass-stars"], // Na
        12: ["high-mass-stars"], // Mg
        13: ["high-mass-stars"], // Al
        14: ["high-mass-stars"], // Si
        15: ["high-mass-stars"], // P
        16: ["high-mass-stars", "white-dwarf-supernova"], // S
        17: ["high-mass-stars"], // Cl
        18: ["high-mass-stars", "white-dwarf-supernova"], // Ar
        // Row 4
        19: ["high-mass-stars"], // K
        20: ["high-mass-stars", "white-dwarf-supernova"], // Ca
        21: ["high-mass-stars"], // Sc
        22: ["white-dwarf-supernova"], // Ti
        23: ["white-dwarf-supernova"], // V
        24: ["white-dwarf-supernova"], // Cr
        25: ["white-dwarf-supernova"], // Mn
        26: ["white-dwarf-supernova"], // Fe
        27: ["white-dwarf-supernova"], // Co
        28: ["white-dwarf-supernova"], // Ni
        29: ["high-mass-stars", "white-dwarf-supernova"], // Cu
        30: ["high-mass-stars", "white-dwarf-supernova"], // Zn
        31: ["high-mass-stars"], // Ga
        32: ["high-mass-stars"], // Ge
        33: ["high-mass-stars"], // As
        34: ["high-mass-stars"], // Se
        35: ["high-mass-stars"], // Br
        36: ["high-mass-stars"], // Kr
        // Row 5
        37: ["high-mass-stars"], // Rb
        38: ["low-mass-stars"], // Sr
        39: ["low-mass-stars"], // Y
        40: ["low-mass-stars"], // Zr
        41: ["low-mass-stars"], // Nb
        42: ["merging-neutron-stars", "low-mass-stars"], // Mo - dual origin
        43: ["radioactive-decay"], // Tc
        44: ["merging-neutron-stars"], // Ru
        45: ["merging-neutron-stars"], // Rh
        46: ["merging-neutron-stars", "low-mass-stars"], // Pd
        47: ["merging-neutron-stars"], // Ag
        48: ["merging-neutron-stars", "low-mass-stars"], // Cd
        49: ["merging-neutron-stars"], // In
        50: ["merging-neutron-stars", "low-mass-stars"], // Sn
        51: ["merging-neutron-stars"], // Sb
        52: ["merging-neutron-stars", "low-mass-stars"], // Te
        53: ["merging-neutron-stars"], // I
        54: ["merging-neutron-stars"], // Xe
        // Row 6
        55: ["merging-neutron-stars"], // Cs
        56: ["low-mass-stars"], // Ba
        72: ["merging-neutron-stars", "high-mass-stars"], // Hf
        73: ["merging-neutron-stars", "high-mass-stars"], // Ta
        74: ["merging-neutron-stars", "high-mass-stars"], // W
        75: ["merging-neutron-stars"], // Re
        76: ["merging-neutron-stars"], // Os
        77: ["merging-neutron-stars"], // Ir
        78: ["merging-neutron-stars"], // Pt
        79: ["merging-neutron-stars"], // Au
        80: ["merging-neutron-stars", "high-mass-stars"], // Hg
        81: ["low-mass-stars"], // Tl
        82: ["merging-neutron-stars", "low-mass-stars"], // Pb
        83: ["merging-neutron-stars"], // Bi
        84: ["radioactive-decay"], // Po
        85: ["radioactive-decay"], // At
        86: ["radioactive-decay"], // Rn
        // Row 7
        87: ["radioactive-decay"], // Fr
        88: ["radioactive-decay"], // Ra
        104: ["human-made"], // Rf
        105: ["human-made"], // Db
        106: ["human-made"], // Sg
        107: ["human-made"], // Bh
        108: ["human-made"], // Hs
        109: ["human-made"], // Mt
        110: ["human-made"], // Ds
        111: ["human-made"], // Rg
        112: ["human-made"], // Cn
        113: ["human-made"], // Nh
        114: ["human-made"], // Fl
        115: ["human-made"], // Mc
        116: ["human-made"], // Lv
        117: ["human-made"], // Ts
        118: ["human-made"], // Og
        // Lanthanides (Row 9)
        57: ["merging-neutron-stars", "low-mass-stars"], // La
        58: ["low-mass-stars"], // Ce
        59: ["merging-neutron-stars", "low-mass-stars"], // Pr
        60: ["merging-neutron-stars", "low-mass-stars"], // Nd
        61: ["radioactive-decay"], // Pm
        62: ["merging-neutron-stars"], // Sm
        63: ["merging-neutron-stars"], // Eu
        64: ["merging-neutron-stars"], // Gd
        65: ["merging-neutron-stars"], // Tb
        66: ["merging-neutron-stars"], // Dy
        67: ["merging-neutron-stars"], // Ho
        68: ["merging-neutron-stars"], // Er
        69: ["merging-neutron-stars"], // Tm
        70: ["merging-neutron-stars"], // Yb
        71: ["merging-neutron-stars"], // Lu
        // Actinides (Row 10)
        89: ["radioactive-decay"], // Ac
        90: ["merging-neutron-stars"], // Th
        91: ["radioactive-decay"], // Pa
        92: ["merging-neutron-stars"], // U
        93: ["radioactive-decay"], // Np
        94: ["merging-neutron-stars"], // Pu
        95: ["human-made"], // Am
        96: ["human-made"], // Cm
        97: ["human-made"], // Bk
        98: ["human-made"], // Cf
        99: ["human-made"], // Es
        100: ["human-made"], // Fm
        101: ["human-made"], // Md
        102: ["human-made"], // No
        103: ["human-made"], // Lr
    }
    return iconMap[atomicNumber] || ["high-mass-stars"] // Default fallback
}

// Element descriptions based on the provided text
const getElementDescription = (atomicNumber: number): string => {
    const descriptions: { [key: number]: string } = {
        5: "is a known antimicrobial that has been linked to enhanced wound healing via release of growth factors and cytokines and increase the turnover of extracellular matrix.", // Boron
        11: "has been shown to play a role in immune cell modulation of T cells and the regulation of immune cell chemotaxis, as macrophages have been shown to migrate towards increasing salt concentrations.", // Sodium
        12: "supports the adhesion of keratinocytes to the extracellular matrix. It has also been shown to disrupt pathogens through the generation of reactive oxygen species which can cause oxidative damage to pathogenic cells.", // Magnesium
        19: "plays an essential role in cell membrane hyperpolarization of epithelial cells. This polarization allows the epithelial cell to carry out special functions.", // Potassium
        20: "is involved with hemostasis, cell migration during wound healing, and as a signal transmitter for cellular activity. While calcium is not an antimicrobial itself, calcium mediated chemotaxis of immune cells toward a site of infection can reduce microbial load and aid in wound healing.", // Calcium
    }

    return (
        descriptions[atomicNumber] ||
        "plays an important role in various biological processes and has unique properties that make it essential for life and technology."
    )
}

// Calculate font size based on text length to ensure it fits
const getDescriptionFontSize = (text: string): number => {
    const baseSize = 11
    const maxSize = 11
    const minSize = 8

    // Rough calculation: if text is longer, make font smaller
    if (text.length > 200) return minSize
    if (text.length > 150) return minSize + 1
    if (text.length > 100) return minSize + 2
    return Math.min(maxSize, baseSize)
}

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

export default function ElementCard({
    element,
    onSelect,
    onNext,
    onPrevious,
    currentIndex,
    totalCount,
    isActive = true,
    isPreview = false,
}: ElementCardProps) {
    // Get origin icons for this element
    const originIcons = getOriginIcons(element.atomicNumber)
    const description = getElementDescription(element.atomicNumber)
    const fullDescription = `${element.name} ${description}`
    const fontSize = getDescriptionFontSize(fullDescription)

    // Enhanced select handler with sound and vibration feedback
    const handleSelect = async () => {
        // We'll determine if it's correct/incorrect in the context, but for now
        // we need to call onSelect first to get the result
        onSelect()
    }

    const renderOriginIcons = () => {
        const iconSize = 32 // Slightly larger for top right position

        return (
            <View style={styles.topRightIconContainer}>
                {originIcons.map((iconType, index) => {
                    // Render different icon types
                    switch (iconType) {
                        case "big-bang":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/big-bang.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "low-mass-stars":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/low-mass-stars.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "high-mass-stars":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/high-mass-stars.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "white-dwarf-supernova":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/white-dwarf-supernova.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "merging-neutron-stars":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/merging-neutron-stars.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "cosmic-ray-fission":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/cosmic-ray-fission.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "radioactive-decay":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/radioactive-decay.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        case "human-made":
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/human-made.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            )
                        default:
                            return null
                    }
                })}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Element Card - Fixed size with uniform dimensions */}
            <BlurView intensity={20} tint="dark" style={[styles.card, isPreview && styles.previewCard]}>
                {/* Only show content if not in preview mode */}
                {!isPreview && (
                    <>
                        {/* Top section: Large Symbol (left) and Origin Icons (right) */}
                        <View style={styles.topSection}>
                            <Text style={styles.largeSymbol}>{element.symbol}</Text>
                            {renderOriginIcons()}
                        </View>

                        {/* Element Name directly below symbol */}
                        <Text style={styles.name}>{element.name}</Text>

                        {/* Description text - only show on active card, fixed container size */}
                        {isActive && (
                            <View style={styles.descriptionContainer}>
                                <Text
                                    style={[styles.description, { fontSize }]}
                                    numberOfLines={6} // Limit to 6 lines max
                                    adjustsFontSizeToFit={true}
                                    minimumFontScale={0.7}
                                >
                                    <Text style={[styles.elementNameInText, { fontSize }]}>{element.name} </Text>
                                    {description}
                                </Text>
                            </View>
                        )}

                        {/* Select Button - only show on active card */}
                        {isActive && (
                            <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
                                <Text style={styles.selectButtonText}>Select</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 150,
        alignItems: "center",
    },
    card: {
        width: "100%",
        height: 240,
        borderRadius: 12,
        padding: 16,
        alignItems: "flex-start",
        borderWidth: 1, // Increased border width
        borderColor: "#FFFFFF", // Bright white border
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 15,
        justifyContent: "space-between",
        overflow: "hidden", // Add this to ensure blur effect works properly
    },
    previewCard: {
        height: 240,
        justifyContent: "flex-start",
        borderColor: "#FFFFFF", // Bright white border for preview too
        borderWidth: 1, // Increased border width for preview
        overflow: "hidden", // Add this to ensure blur effect works properly
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 4,
    },
    largeSymbol: {
        fontSize: 36,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
        color: "#FFFFFF",
        lineHeight: 36,
    },
    topRightIconContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row", // For multiple icons
        gap: 4,
    },
    originIcon: {
        borderRadius: 16,
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
        alignSelf: "flex-start",
        marginBottom: 8,
        marginTop: -2,
    },
    descriptionContainer: {
        height: 100,
        width: "100%",
        marginBottom: 8,
        justifyContent: "flex-start",
    },
    description: {
        fontFamily: getSourceSerifFont("regular"),
        color: "#CCCCCC",
        lineHeight: 14,
        textAlign: "center",
        flex: 1,
    },
    elementNameInText: {
        fontWeight: "600",
        fontFamily: getSourceSerifFont("semibold"),
        color: "#FFFFFF",
    },
    selectButton: {
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)", // More visible button border
        backgroundColor: "rgba(255, 255, 255, 0.08)", // Very subtle background for button
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: "center",
        minWidth: 70,
        alignItems: "center",
    },
    selectButtonText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "400",
        fontFamily: getSourceSerifFont("regular"),
        letterSpacing: 0.5,
    },
})
