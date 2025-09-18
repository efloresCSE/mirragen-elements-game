"use client"

import { StyleSheet, View } from "react-native"
import Svg, { Circle, Path } from "react-native-svg"
import { useThemeTokens } from "../styles/theme"
import type { Element } from "../types/game"

interface WheelIndicatorProps {
  elements: Element[]
  currentIndex: number
}

export default function WheelIndicator({ elements, currentIndex }: WheelIndicatorProps) {
  const { colors, isTablet } = useThemeTokens()

  const DOT_RADIUS = isTablet ? 3.5 : 2.5
  const CONTAINER_WIDTH = isTablet ? 110 : 80
  const CONTAINER_HEIGHT = isTablet ? 400 : 290
  const CURVE_AMOUNT = isTablet ? 48 : 35
  const STROKE_WIDTH = isTablet ? 2 : 1.5
  const ACTIVE_DOT_EXTRA = isTablet ? 0.7 : 0.5
  const ACTIVE_STROKE_WIDTH = isTablet ? 0.7 : 0.5
  const VERTICAL_PADDING = isTablet ? 60 : 45
  const VERTICAL_RANGE = isTablet ? 120 : 90

  const dots = [
    { position: 0, isActive: false },
    { position: 1, isActive: true },
    { position: 2, isActive: false },
  ]

  const getDotPosition = (position: number) => {
    const progress = position / 2
    const y = progress * (CONTAINER_HEIGHT - VERTICAL_RANGE) + VERTICAL_PADDING

    const x = CONTAINER_WIDTH / 2 - Math.sin(progress * Math.PI) * CURVE_AMOUNT

    return { x, y }
  }

  const generatePath = () => {
    const points = dots.map((_, index) => getDotPosition(index))

    const startPoint = points[0]
    const midPoint = points[1]
    const endPoint = points[2]

    const controlOffset = isTablet ? 20 : 15
    const control1X = (startPoint.x + midPoint.x) / 2 - controlOffset
    const control1Y = (startPoint.y + midPoint.y) / 2

    const control2X = (midPoint.x + endPoint.x) / 2 - controlOffset
    const control2Y = (midPoint.y + endPoint.y) / 2

    return `M ${startPoint.x} ${startPoint.y} Q ${control1X} ${control1Y} ${midPoint.x} ${midPoint.y} Q ${control2X} ${control2Y} ${endPoint.x} ${endPoint.y}`
  }

  const styles = StyleSheet.create({
    container: {
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
  })

  return (
    <View style={styles.container}>
      <Svg width={CONTAINER_WIDTH} height={CONTAINER_HEIGHT}>
        <Path d={generatePath()} fill="transparent" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={STROKE_WIDTH} />

        {dots.map((dot, index) => {
          const { x, y } = getDotPosition(dot.position)

          return (
            <Circle
              key={`dot-${index}`}
              cx={x}
              cy={y}
              r={dot.isActive ? DOT_RADIUS + ACTIVE_DOT_EXTRA : DOT_RADIUS}
              fill={dot.isActive ? colors.text : "rgba(255, 255, 255, 0.6)"}
              stroke={dot.isActive ? colors.text : "transparent"}
              strokeWidth={dot.isActive ? ACTIVE_STROKE_WIDTH : "0"}
            />
          )
        })}
      </Svg>
    </View>
  )
}
