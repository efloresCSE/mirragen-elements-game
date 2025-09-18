"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { useThemeTokens } from "../styles/theme"
import type { Element } from "../types/game"
import { playSound } from "../utils/audio"
import ElementCard from "./ElementCard"

interface ElementCarouselProps {
  elements: Element[]
  currentIndex: number
  onSelect: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function ElementCarousel({
  elements,
  currentIndex,
  onSelect,
  onNext,
  onPrevious,
}: ElementCarouselProps) {
  const { isTablet } = useThemeTokens()
  const animationProgress = useSharedValue(0)
  const animationDirection = useSharedValue(0)

  const [isAnimating, setIsAnimating] = useState(false)
  const [elementsUpdated, setElementsUpdated] = useState(false)

  const containerWidth = isTablet ? 200 : 150
  const containerHeight = isTablet ? 800 : 600
  const rightOffset = isTablet ? 120 : 40

  const OFF_SCREEN_TOP = isTablet ? -550 : -450
  const PREVIOUS_TOP = isTablet ? -360 : -280
  const CURRENT_TOP = 0
  const NEXT_TOP = isTablet ? 360 : 280
  const OFF_SCREEN_BOTTOM = isTablet ? 550 : 450

  const SWIPE_THRESHOLD = 40
  const MIN_DISTANCE = 10
  const ACTIVE_OFFSET = 15

  const lastSwipeSoundAt = useRef(0)

  const getPrevIndex = (index: number) => (index > 0 ? index - 1 : elements.length - 1)
  const getNextIndex = (index: number) => (index < elements.length - 1 ? index + 1 : 0)

  const [displayElements, setDisplayElements] = useState(() => {
    return {
      offScreenTop: elements[getPrevIndex(getPrevIndex(currentIndex))],
      previous: elements[getPrevIndex(currentIndex)],
      current: elements[currentIndex],
      next: elements[getNextIndex(currentIndex)],
      offScreenBottom: elements[getNextIndex(getNextIndex(currentIndex))],
    }
  })

  useEffect(() => {
    if (!isAnimating) {
      setDisplayElements({
        offScreenTop: elements[getPrevIndex(getPrevIndex(currentIndex))],
        previous: elements[getPrevIndex(currentIndex)],
        current: elements[currentIndex],
        next: elements[getNextIndex(currentIndex)],
        offScreenBottom: elements[getNextIndex(getNextIndex(currentIndex))],
      })
      setElementsUpdated(false)
    }
  }, [currentIndex, elements, isAnimating])

  const onSwipeJS = useCallback(
    (direction: "next" | "previous") => {
      if (isAnimating) return

      const now = Date.now()
      if (now - lastSwipeSoundAt.current > 200) {
        try {
          playSound(require("../../assets/sound/swipe_dynamic.wav"))
        } catch {}
        lastSwipeSoundAt.current = now
      }

      setIsAnimating(true)
      setElementsUpdated(false)
      animationDirection.value = direction === "next" ? 1 : -1

      const newCurrentIndex = direction === "next" ? getNextIndex(currentIndex) : getPrevIndex(currentIndex)

      setDisplayElements({
        offScreenTop: elements[getPrevIndex(getPrevIndex(newCurrentIndex))],
        previous: elements[getPrevIndex(newCurrentIndex)],
        current: elements[newCurrentIndex],
        next: elements[getNextIndex(newCurrentIndex)],
        offScreenBottom: elements[getNextIndex(getNextIndex(newCurrentIndex))],
      })
      setElementsUpdated(true)

      animationProgress.value = withSpring(
        1,
        {
          damping: 18,
          stiffness: 400,
          mass: 0.3,
        },
        (finished) => {
          if (finished) {
            if (direction === "next") {
              runOnJS(onNext)()
            } else {
              runOnJS(onPrevious)()
            }

            animationProgress.value = 0
            animationDirection.value = 0
            runOnJS(setIsAnimating)(false)
          }
        },
      )
    },
    [isAnimating, currentIndex, elements, animationDirection, animationProgress, onNext, onPrevious],
  )

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(MIN_DISTANCE)
        .activeOffsetX([-ACTIVE_OFFSET, ACTIVE_OFFSET])
        .activeOffsetY([-ACTIVE_OFFSET, ACTIVE_OFFSET])
        .onEnd((e) => {
          const dx = Number(e?.translationX ?? 0)
          const dy = Number(e?.translationY ?? 0)

          if (!Number.isFinite(dx) || !Number.isFinite(dy)) return

          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > SWIPE_THRESHOLD) {
              runOnJS(onSwipeJS)("previous")
            } else if (dx < -SWIPE_THRESHOLD) {
              runOnJS(onSwipeJS)("next")
            }
          } else {
            if (dy < -SWIPE_THRESHOLD) {
              runOnJS(onSwipeJS)("next")
            } else if (dy > SWIPE_THRESHOLD) {
              runOnJS(onSwipeJS)("previous")
            }
          }
        }),
    [onSwipeJS, SWIPE_THRESHOLD, MIN_DISTANCE, ACTIVE_OFFSET],
  )

  const offScreenTopAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = OFF_SCREEN_TOP
    let opacity = 0
    let scale = 0.8
    let rotation = 25

    if (animationDirection.value === -1 && animationProgress.value > 0) {
      const progress = animationProgress.value
      targetTop = interpolate(progress, [0, 1], [OFF_SCREEN_TOP, PREVIOUS_TOP], Extrapolate.CLAMP)
      opacity = interpolate(progress, [0, 0.3, 1], [0, 0.3, 0.6], Extrapolate.CLAMP)
      scale = interpolate(progress, [0, 1], [0.8, 1.0], Extrapolate.CLAMP)
      rotation = interpolate(progress, [0, 1], [25, 15], Extrapolate.CLAMP)
    }

    return {
      top: targetTop,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
      opacity,
    }
  })

  const previousCardAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = PREVIOUS_TOP
    let opacity = 0.6
    let scale = 1.0
    let rotation = 15

    if (animationProgress.value > 0) {
      const progress = animationProgress.value

      if (animationDirection.value === -1) {
        targetTop = interpolate(progress, [0, 1], [PREVIOUS_TOP, CURRENT_TOP], Extrapolate.CLAMP)
        opacity = interpolate(progress, [0, 0.1, 1], [0.6, 0.95, 1], Extrapolate.CLAMP)
        scale = interpolate(progress, [0, 0.2, 1], [1.0, 1.04, 1.05], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [15, 0], Extrapolate.CLAMP)
      } else if (animationDirection.value === 1) {
        targetTop = interpolate(progress, [0, 1], [PREVIOUS_TOP, OFF_SCREEN_TOP], Extrapolate.CLAMP)
        opacity = interpolate(progress, [0, 0.3, 1], [0.6, 0.2, 0], Extrapolate.CLAMP)
        scale = interpolate(progress, [0, 1], [1.0, 0.8], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [15, 25], Extrapolate.CLAMP)
      }
    }

    return {
      top: targetTop,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
      opacity,
    }
  })

  const currentCardAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = CURRENT_TOP
    let opacity = 1
    let scale = 1.05
    let rotation = 0

    if (animationProgress.value > 0) {
      const progress = animationProgress.value

      if (animationDirection.value === 1) {
        targetTop = interpolate(progress, [0, 1], [CURRENT_TOP, PREVIOUS_TOP], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [0, 15], Extrapolate.CLAMP)
      } else if (animationDirection.value === -1) {
        targetTop = interpolate(progress, [0, 1], [CURRENT_TOP, NEXT_TOP], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [0, -15], Extrapolate.CLAMP)
      }

      opacity = interpolate(progress, [0, 0.2, 1], [1, 0.8, 0.6], Extrapolate.CLAMP)
      scale = interpolate(progress, [0, 0.1, 1], [1.05, 1.03, 1.0], Extrapolate.CLAMP)
    }

    return {
      top: targetTop,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
      opacity,
    }
  })

  const nextCardAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = NEXT_TOP
    let opacity = 0.6
    let scale = 1.0
    let rotation = -15

    if (animationProgress.value > 0) {
      const progress = animationProgress.value

      if (animationDirection.value === 1) {
        targetTop = interpolate(progress, [0, 1], [NEXT_TOP, CURRENT_TOP], Extrapolate.CLAMP)
        opacity = interpolate(progress, [0, 0.1, 1], [0.6, 0.95, 1], Extrapolate.CLAMP)
        scale = interpolate(progress, [0, 0.2, 1], [1.0, 1.04, 1.05], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [-15, 0], Extrapolate.CLAMP)
      } else if (animationDirection.value === -1) {
        targetTop = interpolate(progress, [0, 1], [NEXT_TOP, OFF_SCREEN_BOTTOM], Extrapolate.CLAMP)
        opacity = interpolate(progress, [0, 0.3, 1], [0.6, 0.2, 0], Extrapolate.CLAMP)
        scale = interpolate(progress, [0, 1], [1.0, 0.8], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [-15, -25], Extrapolate.CLAMP)
      }
    }

    return {
      top: targetTop,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
      opacity,
    }
  })

  const offScreenBottomAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = OFF_SCREEN_BOTTOM
    let opacity = 0
    let scale = 0.8
    let rotation = -25

    if (animationDirection.value === 1 && animationProgress.value > 0) {
      const progress = animationProgress.value
      targetTop = interpolate(progress, [0, 1], [OFF_SCREEN_BOTTOM, NEXT_TOP], Extrapolate.CLAMP)
      opacity = interpolate(progress, [0, 0.3, 1], [0, 0.3, 0.6], Extrapolate.CLAMP)
      scale = interpolate(progress, [0, 1], [0.8, 1.0], Extrapolate.CLAMP)
      rotation = interpolate(progress, [0, 1], [-25, -15], Extrapolate.CLAMP)
    }

    return {
      top: targetTop,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
      opacity,
    }
  })

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      right: rightOffset,
      top: "50%",
      marginTop: isTablet ? -160 : -120,
      width: containerWidth,
      justifyContent: "center",
      alignItems: "center",
    },
    cardsContainer: {
      width: containerWidth,
      height: containerHeight,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    cardContainer: {
      position: "absolute",
      width: containerWidth,
    },
    currentCard: {
      zIndex: 10,
    },
    previousCard: {
      zIndex: 8,
    },
    nextCard: {
      zIndex: 8,
    },
    offScreenCard: {
      zIndex: 6,
    },
  })

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        <View style={styles.cardsContainer}>
          <Animated.View style={[styles.cardContainer, styles.offScreenCard, offScreenTopAnimatedStyle]}>
            <ElementCard
              element={displayElements.offScreenTop}
              onSelect={() => {}}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>

          <Animated.View style={[styles.cardContainer, styles.previousCard, previousCardAnimatedStyle]}>
            <ElementCard
              element={displayElements.previous}
              onSelect={() => {}}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>

          <Animated.View style={[styles.cardContainer, styles.currentCard, currentCardAnimatedStyle]}>
            <ElementCard
              element={displayElements.current}
              onSelect={onSelect}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={!isAnimating}
              isPreview={isAnimating}
            />
          </Animated.View>

          <Animated.View style={[styles.cardContainer, styles.nextCard, nextCardAnimatedStyle]}>
            <ElementCard
              element={displayElements.next}
              onSelect={() => {}}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>

          <Animated.View style={[styles.cardContainer, styles.offScreenCard, offScreenBottomAnimatedStyle]}>
            <ElementCard
              element={displayElements.offScreenBottom}
              onSelect={() => {}}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  )
}
