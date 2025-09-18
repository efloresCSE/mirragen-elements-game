"use client"

import React, { useEffect, useMemo, useRef } from "react"
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getSourceSerifFont } from "../styles/globalStyles"
import { useThemeTokens } from "../styles/theme"
import type { Element } from "../types/game"
import { getOriginIcons } from "../utils/elements"

interface ElementCellProps {
  element: Element | null
  isTarget: boolean
  isCorrect: boolean
  isHighlighted: boolean
  gamePhase: string
  onPress: () => void
  cellSize?: number
}

const ICON_SOURCES = {
  "big-bang": require("../../assets/images/origin-icons/big-bang.png"),
  "low-mass-stars": require("../../assets/images/origin-icons/low-mass-stars.png"),
  "high-mass-stars": require("../../assets/images/origin-icons/high-mass-stars.png"),
  "white-dwarf-supernova": require("../../assets/images/origin-icons/white-dwarf-supernova.png"),
  "merging-neutron-stars": require("../../assets/images/origin-icons/merging-neutron-stars.png"),
  "cosmic-ray-fission": require("../../assets/images/origin-icons/cosmic-ray-fission.png"),
  "radioactive-decay": require("../../assets/images/origin-icons/radioactive-decay.png"),
  "human-made": require("../../assets/images/origin-icons/human-made.png"),
} as const

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
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
  const { colors, borderRadius, isTablet } = useThemeTokens()
  const flashOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isHighlighted && gamePhase === "recall") {
      const flashAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(flashOpacity, { toValue: 0.4, duration: 900, useNativeDriver: true }),
          Animated.timing(flashOpacity, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]),
      )
      flashAnimation.start()
      return () => {
        flashAnimation.stop()
        flashOpacity.setValue(0)
      }
    } else {
      flashOpacity.setValue(0)
    }
  }, [isHighlighted, gamePhase, flashOpacity])

  const showContent = useMemo(() => {
    if (gamePhase === "memorize") return true
    if (gamePhase === "recall" && !isTarget) return true
    if (gamePhase === "recall" && isTarget && isCorrect) return true
    if (gamePhase === "win" || gamePhase === "lose") return true
    return false
  }, [gamePhase, isTarget, isCorrect])

  const symbolFontSize = useMemo(
    () => clamp(cellSize * (isTablet ? 0.36 : 0.34), 10, isTablet ? 22 : 18),
    [cellSize, isTablet],
  )
  const numberFontSize = useMemo(
    () => clamp(cellSize * (isTablet ? 0.22 : 0.2), 8, isTablet ? 16 : 14),
    [cellSize, isTablet],
  )
  const iconSize = useMemo(
    () => clamp(cellSize * (isTablet ? 0.45 : 0.38), isTablet ? 16 : 12, isTablet ? 26 : 20),
    [cellSize, isTablet],
  )
  const iconGap = useMemo(() => clamp(Math.round(cellSize * 0.08), 2, 6), [cellSize])

  if (!element) {
    return <TouchableOpacity style={[styles.cell, styles.empty, { width: cellSize, height: cellSize }]} disabled />
  }

  const originIcons = getOriginIcons(element.atomicNumber)
  const isSingleIcon = originIcons.length === 1

  const renderOriginIcons = () => (
    <View
      style={[
        styles.iconsContainer,
        isSingleIcon ? styles.singleIconContainer : styles.multipleIconsContainer,
        { bottom: clamp(cellSize * 0.1, 3, 6) },
      ]}
    >
      {originIcons.map((type, idx) => {
        const src = ICON_SOURCES[type as keyof typeof ICON_SOURCES]
        if (!src) return null
        return (
          <Image
            key={`${type}-${idx}`}
            source={src}
            style={[styles.originIcon, { width: iconSize, height: iconSize, marginLeft: idx ? iconGap : 0 }]}
            resizeMode="contain"
          />
        )
      })}
    </View>
  )

  const outlineRadius = borderRadius?.sm ?? 4
  const targetBorderWidth = clamp(Math.round(cellSize * 0.08), 2, 3)

  return (
    <View style={{ position: "relative", width: cellSize, height: cellSize }}>
      {}
      {isTarget && gamePhase === "memorize" && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: outlineRadius,
            borderWidth: targetBorderWidth,
            borderColor: colors.accent,
            zIndex: -1,
          }}
        />
      )}

      <TouchableOpacity
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            borderRadius: outlineRadius,
            backgroundColor: "transparent",
            ...(isHighlighted &&
              gamePhase === "recall" && {
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: clamp(cellSize * 0.25, 6, 12),
                elevation: 12,
              }),
          },
        ]}
        disabled
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${element.name} cell`}
      >
        {}
        {isHighlighted && gamePhase === "recall" && (
          <Animated.View
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: outlineRadius,
              backgroundColor: colors.text,
              opacity: flashOpacity,
              zIndex: 0,
            }}
          />
        )}

        {}
        {showContent && !(isHighlighted && gamePhase === "recall") && (
          <>
            <Text style={[styles.symbol, { fontSize: symbolFontSize, color: colors.text }]}>{element.symbol}</Text>
            <Text style={[styles.atomicNumber, { fontSize: numberFontSize, color: colors.text }]}>
              {element.atomicNumber}
            </Text>
            {renderOriginIcons()}
          </>
        )}

        {}
        {isHighlighted && gamePhase === "recall" && (
          <View style={{ position: "absolute", inset: 0, zIndex: 1 }}>{renderOriginIcons()}</View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center",
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
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  singleIconContainer: {
  },
  multipleIconsContainer: {
    flexDirection: "row",
  },
  originIcon: {
    borderRadius: 50,
  },
})

export default ElementCell
