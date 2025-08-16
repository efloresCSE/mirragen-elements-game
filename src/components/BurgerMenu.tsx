"use client"

import { StyleSheet, TouchableOpacity, View } from "react-native"

interface BurgerMenuProps {
    onPress: () => void
}

export default function BurgerMenu({ onPress }: BurgerMenuProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 40,
        left: 40, // Changed from right: 40 to left: 40
        width: 30,
        height: 24,
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
    },
    line: {
        width: 30,
        height: 3,
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
    },
})
