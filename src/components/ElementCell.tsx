import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getSourceSerifFont } from "../styles/globalStyles";
import type { Element } from "../types/game";

interface ElementCellProps {
    element: Element | null;
    isTarget: boolean;
    isCorrect: boolean;
    isHighlighted: boolean;
    gamePhase: string;
    onPress: () => void;
    cellSize?: number;
}

// Complete origin icons mapping based on the reference image
const getOriginIcons = (atomicNumber: number): string[] => {
    const iconMap: { [key: number]: string[] } = {
        // Row 1 - Big Bang
        1: ['big-bang'], // H
        2: ['big-bang'], // He
        // Row 2
        3: ['low-mass-stars'], // Li
        4: ['cosmic-ray-fission'], // Be
        5: ['cosmic-ray-fission'], // B
        6: ['low-mass-stars'], // C
        7: ['low-mass-stars'], // N
        8: ['high-mass-stars'], // O
        9: ['high-mass-stars'], // F
        10: ['high-mass-stars'], // Ne
        // Row 3
        11: ['high-mass-stars'], // Na
        12: ['high-mass-stars'], // Mg
        13: ['high-mass-stars'], // Al
        14: ['high-mass-stars'], // Si
        15: ['high-mass-stars'], // P
        16: ['high-mass-stars', 'white-dwarf-supernova'], // S
        17: ['high-mass-stars'], // Cl
        18: ['high-mass-stars', 'white-dwarf-supernova'], // Ar
        // Row 4
        19: ['high-mass-stars'], // K
        20: ['high-mass-stars', 'white-dwarf-supernova'], // Ca
        21: ['high-mass-stars'], // Sc
        22: ['white-dwarf-supernova'], // Ti
        23: ['white-dwarf-supernova'], // V
        24: ['white-dwarf-supernova'], // Cr
        25: ['white-dwarf-supernova'], // Mn
        26: ['white-dwarf-supernova'], // Fe
        27: ['white-dwarf-supernova'], // Co
        28: ['white-dwarf-supernova'], // Ni
        29: ['high-mass-stars', 'white-dwarf-supernova'], // Cu
        30: ['high-mass-stars', 'white-dwarf-supernova'], // Zn
        31: ['high-mass-stars'], // Ga
        32: ['high-mass-stars'], // Ge
        33: ['high-mass-stars'], // As
        34: ['high-mass-stars'], // Se
        35: ['high-mass-stars'], // Br
        36: ['high-mass-stars'], // Kr
        // Row 5
        37: ['high-mass-stars'], // Rb
        38: ['low-mass-stars'], // Sr
        39: ['low-mass-stars'], // Y
        40: ['low-mass-stars'], // Zr
        41: ['low-mass-stars'], // Nb
        42: ['merging-neutron-stars', 'low-mass-stars'], // Mo - dual origin
        43: ['radioactive-decay'], // Tc
        44: ['merging-neutron-stars'], // Ru
        45: ['merging-neutron-stars'], // Rh
        46: ['merging-neutron-stars', 'low-mass-stars'], // Pd
        47: ['merging-neutron-stars'], // Ag
        48: ['merging-neutron-stars', 'low-mass-stars'], // Cd
        49: ['merging-neutron-stars'], // In
        50: ['merging-neutron-stars', 'low-mass-stars'], // Sn
        51: ['merging-neutron-stars'], // Sb
        52: ['merging-neutron-stars', 'low-mass-stars'], // Te
        53: ['merging-neutron-stars'], // I
        54: ['merging-neutron-stars'], // Xe
        // Row 6
        55: ['merging-neutron-stars'], // Cs
        56: ['low-mass-stars'], // Ba
        72: ['merging-neutron-stars', 'high-mass-stars'], // Hf
        73: ['merging-neutron-stars', 'high-mass-stars'], // Ta
        74: ['merging-neutron-stars', 'high-mass-stars'], // W
        75: ['merging-neutron-stars'], // Re
        76: ['merging-neutron-stars'], // Os
        77: ['merging-neutron-stars'], // Ir
        78: ['merging-neutron-stars'], // Pt
        79: ['merging-neutron-stars'], // Au
        80: ['merging-neutron-stars', 'high-mass-stars'], // Hg
        81: ['low-mass-stars'], // Tl
        82: ['merging-neutron-stars', 'low-mass-stars'], // Pb
        83: ['merging-neutron-stars'], // Bi
        84: ['radioactive-decay'], // Po
        85: ['radioactive-decay'], // At
        86: ['radioactive-decay'], // Rn
        // Row 7
        87: ['radioactive-decay'], // Fr
        88: ['radioactive-decay'], // Ra
        104: ['human-made'], // Rf
        105: ['human-made'], // Db
        106: ['human-made'], // Sg
        107: ['human-made'], // Bh
        108: ['human-made'], // Hs
        109: ['human-made'], // Mt
        110: ['human-made'], // Ds
        111: ['human-made'], // Rg
        112: ['human-made'], // Cn
        113: ['human-made'], // Nh
        114: ['human-made'], // Fl
        115: ['human-made'], // Mc
        116: ['human-made'], // Lv
        117: ['human-made'], // Ts
        118: ['human-made'], // Og
        // Lanthanides (Row 9)
        57: ['merging-neutron-stars', 'low-mass-stars'], // La
        58: ['low-mass-stars'], // Ce
        59: ['merging-neutron-stars', 'low-mass-stars'], // Pr
        60: ['merging-neutron-stars', 'low-mass-stars'], // Nd
        61: ['radioactive-decay'], // Pm
        62: ['merging-neutron-stars'], // Sm
        63: ['merging-neutron-stars'], // Eu
        64: ['merging-neutron-stars'], // Gd
        65: ['merging-neutron-stars'], // Tb
        66: ['merging-neutron-stars'], // Dy
        67: ['merging-neutron-stars'], // Ho
        68: ['merging-neutron-stars'], // Er
        69: ['merging-neutron-stars'], // Tm
        70: ['merging-neutron-stars'], // Yb
        71: ['merging-neutron-stars'], // Lu
        // Actinides (Row 10)
        89: ['radioactive-decay'], // Ac
        90: ['merging-neutron-stars'], // Th
        91: ['radioactive-decay'], // Pa
        92: ['merging-neutron-stars'], // U
        93: ['radioactive-decay'], // Np
        94: ['merging-neutron-stars'], // Pu
        95: ['human-made'], // Am
        96: ['human-made'], // Cm
        97: ['human-made'], // Bk
        98: ['human-made'], // Cf
        99: ['human-made'], // Es
        100: ['human-made'], // Fm
        101: ['human-made'], // Md
        102: ['human-made'], // No
        103: ['human-made'], // Lr
    };
    return iconMap[atomicNumber] || ['high-mass-stars']; // Default fallback
}

const ElementCell = ({
    element,
    isTarget,
    isCorrect,
    isHighlighted,
    gamePhase,
    onPress,
    cellSize = 40,
}: ElementCellProps) => {
    const flashOpacity = useRef(new Animated.Value(0)).current;

    // Smooth flash animation for highlighted elements during recall
    useEffect(() => {
        if (isHighlighted && gamePhase === "recall") {
            const flashAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(flashOpacity, {
                        toValue: 0.4,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(flashOpacity, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            flashAnimation.start();

            return () => {
                flashAnimation.stop();
                flashOpacity.setValue(0);
            };
        } else {
            flashOpacity.setValue(0);
        }
    }, [isHighlighted, gamePhase, flashOpacity]);

    if (!element) {
        return (
            <TouchableOpacity
                style={[styles.cell, styles.empty, { width: cellSize, height: cellSize }]}
                disabled
            />
        );
    }

    const showContent = () => {
        if (gamePhase === "memorize") return true;
        if (gamePhase === "recall" && !isTarget) return true;
        if (gamePhase === "recall" && isTarget && isCorrect) return true;
        if (gamePhase === "win" || gamePhase === "lose") return true;
        return false;
    };

    // Scale font sizes based on cell size
    const atomicNumberFontSize = Math.max(8, cellSize * 0.2);
    const symbolFontSize = Math.max(12, cellSize * 0.3);

    // Get text color - white for all elements
    const getTextColor = () => "#FFFFFF";

    // Get origin icons for this element
    const originIcons = getOriginIcons(element.atomicNumber);

    const renderOriginIcons = () => {
        const iconSize = cellSize * 0.35;
        const isSingleIcon = originIcons.length === 1;

        return (
            <View
                style={[
                    styles.iconsContainer,
                    isSingleIcon ? styles.singleIconContainer : styles.multipleIconsContainer,
                ]}
            >
                {originIcons.map((iconType, index) => {
                    switch (iconType) {
                        case 'big-bang':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/big-bang.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'low-mass-stars':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/low-mass-stars.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'high-mass-stars':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/high-mass-stars.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'white-dwarf-supernova':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/white-dwarf-supernova.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'merging-neutron-stars':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/merging-neutron-stars.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'cosmic-ray-fission':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/cosmic-ray-fission.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'radioactive-decay':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/radioactive-decay.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        case 'human-made':
                            return (
                                <Image
                                    key={`${iconType}-${index}`}
                                    source={require("../../assets/images/origin-icons/human-made.png")}
                                    style={[styles.originIcon, { width: iconSize, height: iconSize }]}
                                    resizeMode="contain"
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </View>
        );
    };

    const borderWidth = 3;

    return (
        <View style={{
            position: 'relative',
            width: cellSize,
            height: cellSize
        }}>
            {/* Simple colored border for target elements during memorization */}
            {isTarget && gamePhase === "memorize" && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 4,
                        borderWidth: borderWidth,
                        borderColor: '#FFD700', // Gold border
                        zIndex: -1,
                    }}
                />
            )}

            <TouchableOpacity
                style={[
                    styles.cell,
                    {
                        backgroundColor: "transparent",
                        width: cellSize,
                        height: cellSize,
                        // Add outline glow effect for highlighted elements during recall
                        ...(isHighlighted &&
                            gamePhase === "recall" && {
                            shadowColor: "#FFFFFF",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 10,
                            elevation: 15,
                        }),
                    },
                ]}
                onPress={onPress}
                disabled={true}
            >
                {/* Smooth flashing white background for highlighted elements during recall */}
                {isHighlighted && gamePhase === "recall" && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: cellSize,
                            height: cellSize,
                            borderRadius: 4,
                            backgroundColor: '#FFFFFF',
                            opacity: flashOpacity,
                            zIndex: 0,
                        }}
                    />
                )}

                {/* Show normal element content (but not for highlighted elements during recall) */}
                {showContent() && !(isHighlighted && gamePhase === "recall") && (
                    <>
                        {/* Element Symbol - Top Left */}
                        <Text style={[styles.symbol, { fontSize: symbolFontSize, color: getTextColor() }]}>
                            {element.symbol}
                        </Text>

                        {/* Atomic Number - Top Right */}
                        <Text style={[styles.atomicNumber, { fontSize: atomicNumberFontSize, color: getTextColor() }]}>
                            {element.atomicNumber}
                        </Text>

                        {/* Origin Icons - Centered for single, bottom for multiple */}
                        {renderOriginIcons()}
                    </>
                )}

                {/* For highlighted elements during recall, show ONLY the origin icon */}
                {isHighlighted && gamePhase === "recall" && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1
                    }}>
                        {renderOriginIcons()}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cell: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        position: "relative",
    },
    empty: {
        backgroundColor: "transparent",
    },
    symbol: {
        position: "absolute",
        top: 3,
        left: 3,
        fontWeight: "bold",
        fontFamily: getSourceSerifFont("bold"),
    },
    atomicNumber: {
        position: "absolute",
        top: 3,
        right: 3,
        fontWeight: "500",
        fontFamily: getSourceSerifFont("semibold"),
    },
    iconsContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    singleIconContainer: {
        bottom: 4, // Changed from 3 to 4
        left: 0,
        right: 0,
    },
    multipleIconsContainer: {
        bottom: 4, // Changed from 3 to 4
        left: 0,
        right: 0,
        flexDirection: "row",
        gap: 3,
        justifyContent: "center",
    },
    originIcon: {
        borderRadius: 50,
    },
});

export default ElementCell;
