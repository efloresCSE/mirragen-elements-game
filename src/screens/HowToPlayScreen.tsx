"use client";

import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, type ColorValue } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from "react-native-svg";
import { useGame } from "../context/GameContext";
import { getSourceSerifFont } from "../styles/globalStyles";
import { useThemeTokens } from "../styles/theme";
import { initAudio, playSfx } from "../utils/audio";

type GradientSpec = {
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
  locations: readonly [number, number, ...number[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

type CardSpec = {
  id: number;
  title: string;
  gradient: GradientSpec;
  content: "instructions" | "elements" | "start";
};

const howToPlayCards: CardSpec[] = [
  {
    id: 0,
    title: "HOW TO PLAY",
    gradient: {
      colors: ["#20A4F6", "#4B00E2", "#8F0715"] as const,
      locations: [0, 0.8, 1] as const,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    content: "instructions",
  },
  {
    id: 1,
    title: "SPECIAL ELEMENTS",
    gradient: {
      colors: ["#00D97F", "#0093B1", "#004E2D"] as const,
      locations: [0, 0.6, 1] as const,
      start: { x: 1, y: 0 },
      end: { x: 0, y: 1 },
    },
    content: "elements",
  },
  {
    id: 2,
    title: "START MISSION",
    gradient: {
      colors: ["#FFD755", "#E38651", "#0A0358"] as const,
      locations: [0, 0.5, 1] as const,
      start: { x: 1, y: 0 },
      end: { x: 0, y: 1 },
    },
    content: "start",
  },
];

const originData = [
  { icon: require("../../assets/images/origin-icons/big-bang.png"), title: "The big", subtitle: "bang" },
  { icon: require("../../assets/images/origin-icons/low-mass-stars.png"), title: "Dying low", subtitle: "mass stars" },
  { icon: require("../../assets/images/origin-icons/white-dwarf-supernova.png"), title: "White dwarf", subtitle: "supernova" },
  { icon: require("../../assets/images/origin-icons/radioactive-decay.png"), title: "Radioactive", subtitle: "decay" },
  { icon: require("../../assets/images/origin-icons/cosmic-ray-fission.png"), title: "Cosmic ray", subtitle: "collision" },
  { icon: require("../../assets/images/origin-icons/high-mass-stars.png"), title: "Dying high-mass", subtitle: "stars" },
  { icon: require("../../assets/images/origin-icons/merging-neutron-stars.png"), title: "Merging", subtitle: "neutron stars" },
  { icon: require("../../assets/images/origin-icons/human-made.png"), title: "Human-made", subtitle: "" },
];

function SelectionPhaseIcon({ isTablet }: { isTablet: boolean }) {
  const { colors } = useThemeTokens();
  const iconSize = isTablet ? 40 : 30;
  const rectSize = isTablet ? 28 : 20;
  const rectOffset = isTablet ? 6 : 5;
  const gradId = useMemo(() => `cardGradient_${Math.random().toString(36).slice(2)}`, []);
  return (
    <View style={{ position: "relative", width: iconSize, height: iconSize, justifyContent: "center", alignItems: "center" }}>
      <Svg
        width={iconSize}
        height={iconSize}
        style={{
          position: "relative",
          zIndex: 1,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <Defs>
          <SvgLinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#20A4F6" />
            <Stop offset="80%" stopColor="#4B00E2" />
            <Stop offset="100%" stopColor="#8F0715" />
          </SvgLinearGradient>
        </Defs>
        <Rect
          x={rectOffset}
          y={rectOffset}
          width={rectSize}
          height={rectSize}
          fill={`url(#${gradId})`}
          stroke={colors.text}
          strokeWidth="2"
          rx="2"
        />
      </Svg>
    </View>
  );
}

export default function HowToPlayScreen() {
  const { startGame } = useGame();
  const insets = useSafeAreaInsets();
  const { colors, spacing, fontSize, borderRadius, isTablet, width, height } = useThemeTokens();

  useEffect(() => {
    Asset.loadAsync([
      require("../../assets/images/icons/memoryicon.png"),
      require("../../assets/images/icons/hourglass.png"),
      require("../../assets/images/origin-icons/big-bang.png"),
      require("../../assets/images/origin-icons/low-mass-stars.png"),
      require("../../assets/images/origin-icons/white-dwarf-supernova.png"),
      require("../../assets/images/origin-icons/radioactive-decay.png"),
      require("../../assets/images/origin-icons/cosmic-ray-fission.png"),
      require("../../assets/images/origin-icons/high-mass-stars.png"),
      require("../../assets/images/origin-icons/merging-neutron-stars.png"),
      require("../../assets/images/origin-icons/human-made.png"),
    ]).catch(() => {});
    (async () => {
      try {
        await initAudio();
      } catch {}
    })();
  }, []);

  const PHONE_COLLAPSED_W = 70;
  const TABLET_COLLAPSED_W = 70;
  const BASE_PHONE_SIDE_PAD = 12;
  const BASE_TABLET_SIDE_PAD = 120;
  const EXTRA_OUTER_PHONE = 20;
  const EXTRA_OUTER_TABLET = 32;
  const GUTTER = 8;

  const extra = Math.max(isTablet ? EXTRA_OUTER_TABLET : EXTRA_OUTER_PHONE, insets.left, insets.right);
  const sidePad = (isTablet ? BASE_TABLET_SIDE_PAD : BASE_PHONE_SIDE_PAD) + extra;
  const peekWidth = isTablet ? TABLET_COLLAPSED_W : PHONE_COLLAPSED_W;
  const maxActivePhone = Math.round(width * 0.72);
  const maxActiveTablet = Math.round(width * 0.7);

  const activeWidth = isTablet
    ? Math.min(width - 400, maxActiveTablet)
    : Math.min(maxActivePhone, width - (sidePad * 2 + 2 * peekWidth + 2 * GUTTER));
  const activeHeight = Math.max(200, height * 0.8);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        cardsContainer: {
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: sidePad,
        },
        cardWrapper: { marginHorizontal: GUTTER },
        activeCard: { width: activeWidth, height: activeHeight },
        collapsedCard: { width: peekWidth, height: activeHeight },

        collapsedCard1: { width: peekWidth, height: Math.max(160, height * 0.7), borderRadius: borderRadius.md },
        collapsedCard2: { width: peekWidth, height: Math.max(140, height * 0.6), borderRadius: borderRadius.md },
        collapsedCard3: { width: peekWidth, height: Math.max(120, height * 0.5), borderRadius: borderRadius.md },
        collapsedCardEqual: { width: peekWidth, height: Math.max(130, height * 0.65) },

        expandedCard: {
          flex: 1,
          borderRadius: borderRadius.lg,
          padding: isTablet ? spacing.xl : spacing.lg,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 15,
        },
        collapsedCardContent: { flex: 1, borderRadius: borderRadius.md },

        cardTitle: {
          fontSize: fontSize.md,
          fontWeight: "400",
          fontFamily: getSourceSerifFont("regular"),
          color: colors.text,
          textAlign: "center",
          marginBottom: isTablet ? spacing.md : spacing.sm,
          marginTop: isTablet ? spacing.sm : spacing.xs,
          letterSpacing: isTablet ? 3 : 2,
        },

        instructionsContainer: {
          flex: 1,
          justifyContent: "space-evenly",
          paddingVertical: 0,
          paddingHorizontal: isTablet ? 25 : 15,
        },
        instructionItem: {
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: isTablet ? 25 : 15,
          paddingHorizontal: isTablet ? 10 : 5,
        },
        iconContainer: {
          width: isTablet ? 70 : 50,
          height: isTablet ? 70 : 50,
          justifyContent: "center",
          alignItems: "center",
          marginRight: isTablet ? 40 : 30,
          flexShrink: 0,
        },
        instructionIcon: { width: isTablet ? 36 : 24, height: isTablet ? 36 : 24 },

        instructionTextContainer: { flex: 1, paddingRight: isTablet ? 10 : 5, paddingTop: isTablet ? 5 : 2 },
        instructionTitle: {
          fontSize: isTablet ? 18 : 14,
          fontWeight: "700",
          fontFamily: getSourceSerifFont("bold"),
          color: colors.text,
          marginBottom: isTablet ? 8 : 5,
          lineHeight: isTablet ? 22 : 16,
        },
        instructionDescription: {
          fontSize: isTablet ? 16 : 12,
          fontWeight: "400",
          fontFamily: getSourceSerifFont("regular"),
          color: "rgba(255,255,255,0.95)",
          lineHeight: isTablet ? 22 : 16,
          flexWrap: "wrap",
        },

        elementsContainer: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: isTablet ? 20 : 10,
        },
        originIconsContainer: { flex: 2, paddingRight: isTablet ? 30 : 20 },
        iconsGrid: {
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          paddingHorizontal: isTablet ? 20 : 10,
        },
        iconItem: {
          width: isTablet ? "22%" : "20%",
          alignItems: "center",
          marginBottom: isTablet ? 60 : 30,
          marginHorizontal: isTablet ? 8 : 5,
        },
        iconImage: { width: isTablet ? 56 : 32, height: isTablet ? 56 : 32, marginBottom: isTablet ? 12 : 6 },
        iconTitle: {
          fontSize: isTablet ? 14 : 10,
          fontFamily: getSourceSerifFont("semibold"),
          color: colors.text,
          textAlign: "center",
          fontWeight: "500",
          lineHeight: isTablet ? 16 : 12,
        },
        iconSubtitle: {
          fontSize: isTablet ? 14 : 10,
          fontFamily: getSourceSerifFont("regular"),
          color: colors.text,
          textAlign: "center",
          fontWeight: "400",
          lineHeight: isTablet ? 16 : 12,
        },

        startContainer: { flex: 1, justifyContent: "center", alignItems: "center", position: "relative" },
        startButton: {
          backgroundColor: "rgba(255,255,255,0.2)",
          paddingHorizontal: isTablet ? 55 : 35,
          paddingVertical: isTablet ? 25 : 15,
          borderRadius: isTablet ? 30 : 25,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.3)",
        },
        startButtonText: {
          color: colors.text,
          fontSize: isTablet ? fontSize.lg : fontSize.md,
          fontWeight: "bold",
          fontFamily: getSourceSerifFont("bold"),
          letterSpacing: isTablet ? 2.5 : 1.5,
        },
      }),
    [
      colors,
      spacing,
      fontSize,
      borderRadius,
      isTablet,
      width,
      height,
      sidePad,
      peekWidth,
      activeWidth,
      activeHeight,
    ],
  );

  const [currentCard, setCurrentCard] = useState(0);
  const totalCards = howToPlayCards.length;

  const lastSwipeSoundAt = useRef(0);
  const onSwipeJS = useCallback((dir: "prev" | "next", total: number) => {
    const now = Date.now();
    if (now - lastSwipeSoundAt.current > 200) {
      try {
        playSfx("swoosh");
      } catch {}
      lastSwipeSoundAt.current = now;
    }
    setCurrentCard((p) => {
      if (dir === "next") return p < total - 1 ? p + 1 : 0;
      return p > 0 ? p - 1 : total - 1;
    });
  }, []);

  const SWIPE_THRESHOLD = 40;
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(10)
        .activeOffsetX([-15, 15])
        .onEnd((e) => {
          const dx = Number(e?.translationX ?? 0);
          if (!Number.isFinite(dx)) return;
          if (dx > SWIPE_THRESHOLD) {
            runOnJS(onSwipeJS)("prev", totalCards);
          } else if (dx < -SWIPE_THRESHOLD) {
            runOnJS(onSwipeJS)("next", totalCards);
          }
        }),
    [onSwipeJS, totalCards],
  );

  const handleCardPress = (index: number) => {
    try {
      playSfx("click");
    } catch {}
    setCurrentCard(index);
  };

  const handleStart = () => {
    try {
      playSfx("start");
    } catch {}
    startGame();
  };

  const renderInstructionsContent = () => (
    <View style={styles.instructionsContainer}>
      <View style={styles.instructionItem}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/icons/memoryicon.png")}
            style={styles.instructionIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.instructionTextContainer}>
          <Text style={styles.instructionTitle}>Memorization Phase</Text>
          <Text style={styles.instructionDescription}>
            Six elements will glow on the periodic table for 5 seconds—pay close attention to their positions!
          </Text>
        </View>
      </View>

      <View style={styles.instructionItem}>
        <View style={styles.iconContainer}>
          <SelectionPhaseIcon isTablet={isTablet} />
        </View>
        <View style={styles.instructionTextContainer}>
          <Text style={styles.instructionTitle}>Selection Phase</Text>
          <Text style={styles.instructionDescription}>
            After memorization, the elements will be hidden and one glowing position will be highlighted.
          </Text>
        </View>
      </View>

      <View style={styles.instructionItem}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/images/icons/hourglass.png")}
            style={styles.instructionIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.instructionTextContainer}>
          <Text style={styles.instructionTitle}>Time Pressure</Text>
          <Text style={styles.instructionDescription}>Choose correctly within 5 seconds for maximum mission success.</Text>
        </View>
      </View>
    </View>
  );

  const renderElementsContent = () => (
    <View style={styles.elementsContainer}>
      <View style={styles.originIconsContainer}>
        <View style={styles.iconsGrid}>
          {originData.map((item, index) => (
            <View key={index} style={styles.iconItem}>
              <Image source={item.icon} style={styles.iconImage} resizeMode="contain" />
              <Text style={styles.iconTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.iconSubtitle}>{item.subtitle}</Text> : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStartContent = () => (
    <View style={styles.startContainer}>
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>START MISSION</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCardContent = (card: CardSpec) =>
    card.content === "instructions"
      ? renderInstructionsContent()
      : card.content === "elements"
      ? renderElementsContent()
      : renderStartContent();

  const getCollapsedStyle = (index: number) => {
    if (currentCard === 0) return index === 0 ? styles.collapsedCard1 : index === 1 ? styles.collapsedCard2 : styles.collapsedCard3;
    if (currentCard === 1) return styles.collapsedCard2;
    return index === 0 ? styles.collapsedCard3 : index === 1 ? styles.collapsedCard2 : styles.collapsedCard1;
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View style={styles.cardsContainer}>
          {howToPlayCards.map((card, index) => {
            const isActiveCard = index === currentCard;
            const cardStyle = isActiveCard ? styles.activeCard : getCollapsedStyle(index);
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardWrapper, cardStyle]}
                onPress={() => handleCardPress(index)}
                activeOpacity={1}
              >
                {isActiveCard ? (
                  <LinearGradient
                    colors={card.gradient.colors}
                    locations={card.gradient.locations}
                    start={card.gradient.start}
                    end={card.gradient.end}
                    style={styles.expandedCard}
                  >
                    {card.content !== "start" && card.title && <Text style={styles.cardTitle}>{card.title}</Text>}
                    {renderCardContent(card)}
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.collapsedCardContent,
                      {
                        backgroundColor:
                          currentCard === 1 ? "#393938" : index === 1 ? "#393938" : index === 2 ? "#242222" : "#242222",
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </GestureDetector>
    </View>
  );
}
