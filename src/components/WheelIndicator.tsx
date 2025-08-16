"use client"
import { StyleSheet, View } from "react-native"
import Svg, { Circle, Path } from "react-native-svg"
import type { Element } from "../types/game"

interface WheelIndicatorProps {
    elements: Element[]
    currentIndex: number
}

export default function WheelIndicator({ elements, currentIndex }: WheelIndicatorProps) {
    const DOT_RADIUS = 2.5 // Much smaller dots like in reference
    const CONTAINER_WIDTH = 80 // Increased width to accommodate more curve
    const CONTAINER_HEIGHT = 290 // Slightly longer arc

    // Only show 3 dots: previous, current, next
    const dots = [
        { position: 0, isActive: false }, // Previous (top)
        { position: 1, isActive: true }, // Current (middle)
        { position: 2, isActive: false }, // Next (bottom)
    ]

    // Calculate positions for the 3 dots in a much longer arc
    const getDotPosition = (position: number) => {
        const progress = position / 2 // 0, 0.5, 1 for the three positions
        const y = progress * (CONTAINER_HEIGHT - 90) + 45 // Vertical spacing

        // Create a more pronounced curve that curves to the left
        const curveAmount = 35 // Much more curved
        const x = CONTAINER_WIDTH / 2 - Math.sin(progress * Math.PI) * curveAmount

        return { x, y }
    }

    // Generate path that actually connects through all three dots
    const generatePath = () => {
        const points = dots.map((_, index) => getDotPosition(index))

        const startPoint = points[0]
        const midPoint = points[1]
        const endPoint = points[2]

        // Create two quadratic curves that meet at the middle dot
        // First curve: start to middle
        const control1X = (startPoint.x + midPoint.x) / 2 - 15 // Control point for first curve
        const control1Y = (startPoint.y + midPoint.y) / 2

        // Second curve: middle to end
        const control2X = (midPoint.x + endPoint.x) / 2 - 15 // Control point for second curve
        const control2Y = (midPoint.y + endPoint.y) / 2

        return `M ${startPoint.x} ${startPoint.y} Q ${control1X} ${control1Y} ${midPoint.x} ${midPoint.y} Q ${control2X} ${control2Y} ${endPoint.x} ${endPoint.y}`
    }

    return (
        <View style={styles.container}>
            <Svg width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT}>
                {/* Connecting arc line */}
                <Path d={generatePath()} fill="transparent" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />

                {/* Dots */}
                {dots.map((dot, index) => {
                    const { x, y } = getDotPosition(dot.position)

                    return (
                        <Circle
                            key={`dot-${index}`}
                            cx={x}
                            cy={y}
                            r={dot.isActive ? DOT_RADIUS + 0.5 : DOT_RADIUS}
                            fill={dot.isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
                            stroke={dot.isActive ? "#FFFFFF" : "transparent"}
                            strokeWidth={dot.isActive ? "0.5" : "0"}
                        />
                    )
                })}
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 80, // Increased width to accommodate more curve
        height: 290,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
})
