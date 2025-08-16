import { StyleSheet } from "react-native"

export const globalStyles = StyleSheet.create({
    text: {
        fontFamily: "SourceSerifPro_400Regular",
    },
    textSemiBold: {
        fontFamily: "SourceSerifPro_600SemiBold",
    },
    textBold: {
        fontFamily: "SourceSerifPro_700Bold",
    },
})

// Helper function to get font family based on weight
export const getSourceSerifFont = (weight: "regular" | "semibold" | "bold" = "regular") => {
    switch (weight) {
        case "semibold":
            return "SourceSerifPro_600SemiBold"
        case "bold":
            return "SourceSerifPro_700Bold"
        default:
            return "SourceSerifPro_400Regular"
    }
}
