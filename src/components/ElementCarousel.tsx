"use client"
import { useEffect, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import type { Element } from "../types/game"
import ElementCard from "./ElementCard"

const { width, height } = Dimensions.get("window")

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
  const animationProgress = useSharedValue(0)
  const animationDirection = useSharedValue(0)

  const [isAnimating, setIsAnimating] = useState(false)
  const [elementsUpdated, setElementsUpdated] = useState(false)

  // Helper functions
  const getPrevIndex = (index: number) => (index > 0 ? index - 1 : elements.length - 1)
  const getNextIndex = (index: number) => (index < elements.length - 1 ? index + 1 : 0)

  // Always render 5 cards: one off-screen above, previous, current, next, one off-screen below
  const [displayElements, setDisplayElements] = useState(() => {
    return {
      offScreenTop: elements[getPrevIndex(getPrevIndex(currentIndex))], // 2 positions back
      previous: elements[getPrevIndex(currentIndex)],
      current: elements[currentIndex],
      next: elements[getNextIndex(currentIndex)],
      offScreenBottom: elements[getNextIndex(getNextIndex(currentIndex))], // 2 positions forward
    }
  })

  // Update elements immediately when currentIndex changes, but only if not animating
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

  const handleSwipe = (event: any) => {
    if (event.nativeEvent.state === State.END && !isAnimating) {
      const { translationX, translationY } = event.nativeEvent

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 15) {
          animateCarousel("previous")
        } else if (translationX < -15) {
          animateCarousel("next")
        }
      } else {
        if (translationY < -15) {
          animateCarousel("next")
        } else if (translationY > 15) {
          animateCarousel("previous")
        }
      }
    }
  }

  // Function to update elements mid-animation
  const updateElementsForAnimation = (direction: "next" | "previous") => {
    if (elementsUpdated) return // Prevent multiple updates

    const newCurrentIndex = direction === "next" ? getNextIndex(currentIndex) : getPrevIndex(currentIndex)

    setDisplayElements({
      offScreenTop: elements[getPrevIndex(getPrevIndex(newCurrentIndex))],
      previous: elements[getPrevIndex(newCurrentIndex)],
      current: elements[newCurrentIndex],
      next: elements[getNextIndex(newCurrentIndex)],
      offScreenBottom: elements[getNextIndex(getNextIndex(newCurrentIndex))],
    })
    setElementsUpdated(true)
  }

  const animateCarousel = (direction: "next" | "previous") => {
    // Play swipe sound
    playSound(require("../../assets/sound/swipe_dynamic.wav"))

    setIsAnimating(true)
    setElementsUpdated(false)
    animationDirection.value = direction === "next" ? 1 : -1

    // Update elements immediately when animation starts
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
        damping: 18, // Reduced from 25 to 18 for much faster animation
        stiffness: 400, // Increased from 300 to 400 for faster animation
        mass: 0.3, // Reduced from 0.5 to 0.3 for much faster animation
      },
      (finished) => {
        if (finished) {
          // Trigger the index change
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
  }

  // Base positions
  const OFF_SCREEN_TOP = -450
  const PREVIOUS_TOP = -280
  const CURRENT_TOP = 0
  const NEXT_TOP = 280
  const OFF_SCREEN_BOTTOM = 450

  // Off-screen top card (slides in when going previous)
  const offScreenTopAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = OFF_SCREEN_TOP
    let opacity = 0
    let scale = 0.8
    let rotation = 25

    if (animationDirection.value === -1 && animationProgress.value > 0) {
      // Slide in from off-screen top to previous position (when going previous)
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

  // Previous card
  const previousCardAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = PREVIOUS_TOP
    let opacity = 0.6
    let scale = 1.0
    let rotation = 15

    if (animationProgress.value > 0) {
      const progress = animationProgress.value

      if (animationDirection.value === -1) {
        // Moving to center (going previous)
        targetTop = interpolate(progress, [0, 1], [PREVIOUS_TOP, CURRENT_TOP], Extrapolate.CLAMP)
        opacity = interpolate(progress, [0, 0.1, 1], [0.6, 0.95, 1], Extrapolate.CLAMP)
        scale = interpolate(progress, [0, 0.2, 1], [1.0, 1.04, 1.05], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [15, 0], Extrapolate.CLAMP)
      } else if (animationDirection.value === 1) {
        // Exiting off-screen top (going next)
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

  // Current card
  const currentCardAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = CURRENT_TOP
    let opacity = 1
    let scale = 1.05
    let rotation = 0

    if (animationProgress.value > 0) {
      const progress = animationProgress.value

      if (animationDirection.value === 1) {
        // Moving to previous position (going next)
        targetTop = interpolate(progress, [0, 1], [CURRENT_TOP, PREVIOUS_TOP], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [0, 15], Extrapolate.CLAMP)
      } else if (animationDirection.value === -1) {
        // Moving to next position (going previous)
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

  // Next card
  const nextCardAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = NEXT_TOP
    let opacity = 0.6
    let scale = 1.0
    let rotation = -15

    if (animationProgress.value > 0) {
      const progress = animationProgress.value

      if (animationDirection.value === 1) {
        // Moving to center (going next)
        targetTop = interpolate(progress, [0, 1], [NEXT_TOP, CURRENT_TOP], Extrapolate.CLAMP)
        opacity = interpolate(progress, [0, 0.1, 1], [0.6, 0.95, 1], Extrapolate.CLAMP)
        scale = interpolate(progress, [0, 0.2, 1], [1.0, 1.04, 1.05], Extrapolate.CLAMP)
        rotation = interpolate(progress, [0, 1], [-15, 0], Extrapolate.CLAMP)
      } else if (animationDirection.value === -1) {
        // Exiting off-screen bottom (going previous)
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

  // Off-screen bottom card (slides in when going next)
  const offScreenBottomAnimatedStyle = useAnimatedStyle(() => {
    let targetTop = OFF_SCREEN_BOTTOM
    let opacity = 0
    let scale = 0.8
    let rotation = -25

    if (animationDirection.value === 1 && animationProgress.value > 0) {
      // Slide in from off-screen bottom to next position (when going next)
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

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <View style={styles.container}>
        <View style={styles.cardsContainer}>
          {/* Off-screen top card */}
          <Animated.View style={[styles.cardContainer, styles.offScreenCard, offScreenTopAnimatedStyle]}>
            <ElementCard
              element={displayElements.offScreenTop}
              onSelect={() => { }}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>

          {/* Previous card */}
          <Animated.View style={[styles.cardContainer, styles.previousCard, previousCardAnimatedStyle]}>
            <ElementCard
              element={displayElements.previous}
              onSelect={() => { }}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>

          {/* Current card */}
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

          {/* Next card */}
          <Animated.View style={[styles.cardContainer, styles.nextCard, nextCardAnimatedStyle]}>
            <ElementCard
              element={displayElements.next}
              onSelect={() => { }}
              onNext={onNext}
              onPrevious={onPrevious}
              currentIndex={currentIndex}
              totalCount={elements.length}
              isActive={false}
              isPreview={true}
            />
          </Animated.View>

          {/* Off-screen bottom card */}
          <Animated.View style={[styles.cardContainer, styles.offScreenCard, offScreenBottomAnimatedStyle]}>
            <ElementCard
              element={displayElements.offScreenBottom}
              onSelect={() => { }}
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
    </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 40,
    top: "50%",
    marginTop: -120,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  cardsContainer: {
    width: 150,
    height: 600,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cardContainer: {
    position: "absolute",
    width: 150,
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
