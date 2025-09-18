"use client"

import { useEffect, useMemo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useGame } from "../context/GameContext"
import { getSourceSerifFont } from "../styles/globalStyles"
import { useThemeTokens } from "../styles/theme"
import { playSfx, setSfxVolume } from "../utils/audio"

export default function GameEndScreen() {
  const { gameState, resetGame, showHowToPlay } = useGame()
  const { colors, fontSize, spacing, borderRadius, isTablet } = useThemeTokens()

  const totalTargets = Math.max(1, gameState.targetElements.length)
  const percentage = Math.round((gameState.correctPlacements.length / totalTargets) * 100)

  const averageResponseTime =
    gameState.responseTimes.length > 0
      ? gameState.responseTimes.reduce((sum, t) => sum + t, 0) / gameState.responseTimes.length / 1000
      : 0

  const isSuccess = percentage === 100
  const missionStatus = isSuccess ? "MISSION SUCCEEDED" : "MISSION FAILED"
  const statusColor = isSuccess ? colors.success : colors.error

  useEffect(() => {
    ;(async () => {
      try {
        await setSfxVolume("success", 0.5)
        await setSfxVolume("fail", 0.5)
        setTimeout(() => {
          playSfx(isSuccess ? "success" : "fail")
        }, 300)
      } catch {
      }
    })()
  }, [isSuccess])

  const handlePlayAgain = () => {
    try {
      playSfx("press")
    } catch {}
    resetGame()
  }

  const handleHowToPlay = () => {
    try {
      playSfx("info")
    } catch {}
    showHowToPlay()
  }

  const s = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: isTablet ? 1300 : 980,
          paddingHorizontal: isTablet ? spacing.xl : spacing.lg,
        },

        statsSection: {
          flex: 1,
          alignItems: "center",
          paddingRight: spacing.sm,
          minWidth: isTablet ? 220 : 160,
        },
        missionStatus: {
          fontSize: isTablet ? 18 : 14,
          fontWeight: "600",
          fontFamily: getSourceSerifFont("semibold"),
          letterSpacing: isTablet ? 1.5 : 1,
          marginBottom: isTablet ? spacing.md : spacing.sm,
          textAlign: "center",
          color: statusColor,
        },
        percentage: {
          fontSize: isTablet ? 96 : 72,
          fontWeight: "bold",
          fontFamily: getSourceSerifFont("bold"),
          color: colors.text,
          marginBottom: isTablet ? spacing.lg : spacing.md,
          textAlign: "center",
          width: "100%",
          minWidth: isTablet ? 160 : 120,
        },
        responseTimeContainer: {
          alignItems: "center",
        },
        responseTime: {
          fontSize: fontSize.xl,
          fontWeight: "bold",
          fontFamily: getSourceSerifFont("bold"),
          color: colors.text,
          marginBottom: spacing.xs,
          textAlign: "center",
        },
        responseLabel: {
          fontSize: isTablet ? 16 : 12,
          fontFamily: getSourceSerifFont("regular"),
          color: colors.textSecondary,
          lineHeight: isTablet ? 18 : 14,
          textAlign: "center",
        },

        separator: {
          width: isTablet ? 3 : 2,
          height: isTablet ? 320 : 240,
          backgroundColor: colors.border,
          marginHorizontal: isTablet ? spacing.md : spacing.sm,
        },
        elementsSection: {
          flex: 1.2,
          paddingHorizontal: spacing.sm,
          alignItems: "flex-start",
        },
        elementRow: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: isTablet ? spacing.md : spacing.sm,
        },
        elementSymbol: {
          width: isTablet ? 42 : 32,
          height: isTablet ? 42 : 32,
          borderWidth: isTablet ? 1.5 : 1,
          borderRadius: borderRadius.sm,
          justifyContent: "center",
          alignItems: "center",
          marginRight: isTablet ? spacing.md : spacing.sm,
        },
        symbolText: {
          fontSize: isTablet ? 18 : 14,
          fontWeight: "bold",
          fontFamily: getSourceSerifFont("bold"),
        },
        elementName: {
          fontSize: fontSize.md,
          fontWeight: "400",
          fontFamily: getSourceSerifFont("regular"),
          color: colors.text,
        },

        buttonsSection: {
          flex: 0.8,
          alignItems: "flex-start", 
          justifyContent: "center",
          paddingLeft: isTablet ? spacing.md : spacing.sm, 
        },
        playAgainButton: {
          borderWidth: isTablet ? 1.5 : 1,
          borderColor: colors.border,
          paddingHorizontal: isTablet ? 28 : 20,
          paddingVertical: isTablet ? 14 : 10,
          borderRadius: borderRadius.sm,
          marginBottom: isTablet ? spacing.lg : spacing.md,
          minWidth: isTablet ? 180 : 140,
          alignItems: "center",
        },
        playAgainText: {
          color: colors.text,
          fontSize: isTablet ? 16 : 12,
          fontWeight: "500",
          fontFamily: getSourceSerifFont("semibold"),
          letterSpacing: isTablet ? 1.5 : 1,
          textAlign: "center",
        },
        howToPlayButton: {
          paddingHorizontal: isTablet ? 28 : 20,
          paddingVertical: isTablet ? 14 : 10,
          minWidth: isTablet ? 180 : 140,
          alignItems: "center",
        },
        howToPlayText: {
          color: colors.text,
          fontSize: isTablet ? 16 : 12,
          fontWeight: "400",
          fontFamily: getSourceSerifFont("regular"),
          letterSpacing: isTablet ? 1.5 : 1,
          textDecorationLine: "underline",
          textAlign: "center",
        },
      }),
    [colors, fontSize, spacing, borderRadius, isTablet, statusColor],
  )

  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.statsSection}>
          <Text style={s.missionStatus}>{missionStatus}</Text>
          <Text style={s.percentage} numberOfLines={1} adjustsFontSizeToFit>
            {percentage}%
          </Text>
          <View style={s.responseTimeContainer}>
            <Text style={s.responseTime}>{averageResponseTime.toFixed(1)} sec</Text>
            <Text style={s.responseLabel}>Avg Response</Text>
            <Text style={s.responseLabel}>Time</Text>
          </View>
        </View>

        <View style={s.separator} />

        <View style={s.elementsSection}>
          {gameState.targetElements.map((el) => {
            const correct = gameState.correctPlacements.includes(el.atomicNumber)
            const color = correct ? colors.success : colors.text
            return (
              <View key={el.atomicNumber} style={s.elementRow}>
                <View style={[s.elementSymbol, { borderColor: color }]}>
                  <Text style={[s.symbolText, { color }]}>{el.symbol}</Text>
                </View>
                <Text style={[s.elementName, { color }]}>{el.name}</Text>
              </View>
            )
          })}
        </View>

       
        <View style={s.buttonsSection}>
          <TouchableOpacity style={s.playAgainButton} onPress={handlePlayAgain}>
            <Text style={s.playAgainText}>PLAY AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.howToPlayButton} onPress={handleHowToPlay}>
            <Text style={s.howToPlayText}>HOW TO PLAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
