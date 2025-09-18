"use client"

import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import BurgerMenu from "../components/BurgerMenu"
import ElementCarousel from "../components/ElementCarousel"
import OriginPopup from "../components/OriginPopup"
import PeriodicTable from "../components/PeriodicTable"
import WheelIndicator from "../components/WheelIndicator"
import { useGame } from "../context/GameContext"
import { getSourceSerifFont } from "../styles/globalStyles"
import { useThemeTokens } from "../styles/theme"
import { preloadOriginIcons } from "../utils/assets"
import GameEndScreen from "./GameEndScreen"
import HowToPlayScreen from "./HowToPlayScreen"
import StartScreen from "./StartScreen"

export default function GameScreen() {
  const {
    gameState,
    tickTimer,
    tickRecallTimer,
    nextChoice,
    previousChoice,
    selectCurrentChoice,
    showOriginPopup,
    hideOriginPopup,
    showHowToPlay,
  } = useGame()

  const { colors, fontSize, spacing, width } = useThemeTokens()
  const wide = width > 768

  const [iconsReady, setIconsReady] = useState(false)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        await preloadOriginIcons()
      } catch {}
      if (alive) setIconsReady(true)
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (gameState.phase === "memorize" && gameState.timeRemaining > 0 && !gameState.isPaused) {
      interval = setInterval(() => tickTimer(), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.phase, gameState.timeRemaining, gameState.isPaused, tickTimer])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (gameState.phase === "recall" && gameState.recallTimeRemaining > 0 && !gameState.isPaused) {
      interval = setInterval(() => tickRecallTimer(), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.phase, gameState.recallTimeRemaining, gameState.isPaused, tickRecallTimer])

  const renderProgressCircles = () =>
    Array.from({ length: 5 }).map((_, i) => {
      const isFilled = i < gameState.correctPlacements.length
      return <View key={`p-${i}`} style={[s.circle, isFilled ? s.progressFilled : s.circleEmpty]} />
    })

  const renderMistakeCircles = () =>
    Array.from({ length: 3 }).map((_, i) => {
      const isFilled = i < gameState.mistakes
      return <View key={`m-${i}`} style={[s.circle, isFilled ? s.mistakeFilled : s.circleEmpty]} />
    })

  if (gameState.phase === "menu") return <StartScreen />
  if (gameState.phase === "howToPlay") return <HowToPlayScreen />
  if (gameState.phase === "gameEnd") return <GameEndScreen />

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    tableContainer: { flex: 1, position: "relative" },

    memorizeOverlay: {
      position: "absolute",
      top: 40,
      left: 0,
      right: wide ? 160 : 140,
      alignItems: "center",
      zIndex: 10,
    },
    memorizeTitle: {
      fontSize: fontSize.lg,
      fontWeight: "600",
      fontFamily: getSourceSerifFont("semibold"),
      color: colors.text,
      letterSpacing: wide ? 3 : 2,
      marginBottom: spacing.sm,
    },
    memorizeTimer: {
      fontSize: fontSize.xl,
      fontWeight: "bold",
      fontFamily: getSourceSerifFont("bold"),
      color: colors.text,
      textAlign: "center",
    },

    centerOverlay: {
      position: "absolute",
      top: 30,
      left: 0,
      right: wide ? 160 : 140,
      alignItems: "center",
      zIndex: 10,
    },
    timerSection: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.lg },
    circlesContainer: { alignItems: "flex-start", gap: spacing.sm },
    timer: {
      fontSize: wide ? 42 : 32,
      fontWeight: "bold",
      fontFamily: getSourceSerifFont("bold"),
      color: colors.text,
      textAlign: "center",
      minWidth: wide ? 80 : 60,
    },
    timerWarning: { color: colors.error },

    mistakeCircles: { flexDirection: "row", gap: wide ? 10 : 6 },
    progressCircles: { flexDirection: "row", gap: wide ? 10 : 6 },
    circle: {
      width: wide ? 12 : 8,
      height: wide ? 12 : 8,
      borderRadius: wide ? 6 : 4,
      borderWidth: wide ? 3 : 2,
    },
    circleEmpty: { borderColor: colors.border, backgroundColor: "transparent" },
    progressFilled: { borderColor: colors.success, backgroundColor: colors.success },
    mistakeFilled: { borderColor: colors.error, backgroundColor: colors.error },

    wheelIndicatorContainer: {
      position: "absolute",
      right: 0,
      top: "50%",
      marginTop: wide ? -140 : -120, 
      zIndex: 20,
    },
  })

  const needsIcons = gameState.phase === "memorize" || gameState.phase === "recall"
  if (needsIcons && !iconsReady) {
    return <SafeAreaView style={s.container} />
  }

  switch (gameState.phase) {
    case "memorize":
      return (
        <SafeAreaView style={s.container}>
          <View style={s.memorizeOverlay}>
            <Text style={s.memorizeTitle}>MEMORIZE</Text>
            <Text style={s.memorizeTimer}>{gameState.timeRemaining}</Text>
          </View>

          <View style={s.tableContainer}>
            <PeriodicTable />
          </View>

          <BurgerMenu onPress={showOriginPopup} />
          <OriginPopup
            visible={gameState.showOriginPopup}
            onClose={hideOriginPopup}
            onHowToPlay={() => {
              hideOriginPopup()
              showHowToPlay()
            }}
          />
        </SafeAreaView>
      )

    case "recall":
      return (
        <SafeAreaView style={s.container}>
          <View style={s.centerOverlay}>
            <View style={s.timerSection}>
              <View style={s.circlesContainer}>
                <View style={s.progressCircles}>{renderProgressCircles()}</View>
                <View style={s.mistakeCircles}>{renderMistakeCircles()}</View>
              </View>

              <Text style={[s.timer, gameState.recallTimeRemaining <= 10 ? s.timerWarning : null]}>
                {gameState.recallTimeRemaining}
              </Text>
            </View>
          </View>

          <View style={s.tableContainer}>
            <PeriodicTable />
            <ElementCarousel
              elements={gameState.availableChoices}
              currentIndex={gameState.currentChoiceIndex}
              onSelect={selectCurrentChoice}
              onNext={nextChoice}
              onPrevious={previousChoice}
            />
          </View>

          <View style={s.wheelIndicatorContainer}>
            <WheelIndicator elements={gameState.availableChoices} currentIndex={gameState.currentChoiceIndex} />
          </View>

          <BurgerMenu onPress={showOriginPopup} />
          <OriginPopup
            visible={gameState.showOriginPopup}
            onClose={hideOriginPopup}
            onHowToPlay={() => {
              hideOriginPopup()
              showHowToPlay()
            }}
          />
        </SafeAreaView>
      )

    default:
      return null
  }
}
