"use client";

import { Asset } from "expo-asset";
import { Image } from "expo-image";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../context/GameContext";
import { getSourceSerifFont } from "../styles/globalStyles";
import { useThemeTokens } from "../styles/theme";
import { playSfx } from "../utils/audio";

export default function StartScreen() {
  const { startGame, showHowToPlay } = useGame();
  const insets = useSafeAreaInsets();

  const { colors, spacing, fontSize, borderRadius, isTablet, width, height } = useThemeTokens();

  useEffect(() => {
    Asset.loadAsync([require("../../assets/images/ETS-logo.png")]).catch(() => {});
  }, []);

  const BASE_PHONE_SIDE_PAD = 12;
  const BASE_TABLET_SIDE_PAD = 120;
  const EXTRA_OUTER_PHONE = 20;
  const EXTRA_OUTER_TABLET = 32;

  const sidePad =
    (isTablet ? BASE_TABLET_SIDE_PAD : BASE_PHONE_SIDE_PAD) +
    Math.max(isTablet ? EXTRA_OUTER_TABLET : EXTRA_OUTER_PHONE, insets.left, insets.right);

  const phoneLargeLandscape = !isTablet && Math.min(width, height) >= 400;

  const contentWidth = isTablet
    ? Math.min(width - sidePad * 2, 820)
    : Math.min(width - sidePad * 2, phoneLargeLandscape ? 640 : 560);

  const logoSize = isTablet ? 90 : 60;
  const letterSpace = isTablet ? 3 : 2;
  const titleFS = fontSize.xxl;
  const playPadH = isTablet ? 18 : 12;
  const playPadW = isTablet ? 45 : 30;
  const playMinW = isTablet ? 220 : 160;
  const playShadow = isTablet ? 20 : 15;
  const playBorderW = isTablet ? 1.5 : 1;
  const howToPadV = isTablet ? 15 : 10;
  const howToFS = isTablet ? 18 : 14;

  const s = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: sidePad,
        },
        content: { width: contentWidth, alignItems: "center", justifyContent: "center" },
        logo: { width: logoSize, height: logoSize, marginBottom: spacing.xl },
        title: {
          fontSize: titleFS,
          fontWeight: "300",
          fontFamily: getSourceSerifFont("regular"),
          color: colors.text,
          textAlign: "center",
          letterSpacing: letterSpace,
          marginBottom: spacing.xs,
        },
        buttonContainer: { marginTop: spacing.xxl, alignItems: "center" },
        playButton: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderWidth: playBorderW,
          borderColor: colors.accent,
          paddingHorizontal: playPadW,
          paddingVertical: playPadH,
          borderRadius: borderRadius.sm,
          marginBottom: isTablet ? 40 : 30,
          minWidth: playMinW,
          alignItems: "center",
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: playShadow,
          elevation: playShadow,
        },
        playButtonText: {
          color: colors.text,
          fontSize: fontSize.md,
          fontWeight: "600",
          fontFamily: getSourceSerifFont("semibold"),
          letterSpacing: isTablet ? 1.5 : 1,
        },
        howToPlayButton: {
          paddingHorizontal: spacing.lg,
          paddingVertical: howToPadV,
          alignItems: "center",
        },
        howToPlayButtonText: {
          color: colors.text,
          fontSize: howToFS,
          fontWeight: "400",
          fontFamily: getSourceSerifFont("regular"),
          letterSpacing: isTablet ? 1.5 : 1,
          textDecorationLine: "underline",
        },
      }),
    [
      colors,
      spacing,
      fontSize,
      borderRadius,
      isTablet,
      sidePad,
      contentWidth,
      logoSize,
      letterSpace,
      titleFS,
      playPadH,
      playPadW,
      playMinW,
      playShadow,
      playBorderW,
      howToPadV,
      howToFS,
    ],
  );

  return (
    <View style={s.container}>
      <View style={s.content}>
        <Image
          source={require("../../assets/images/ETS-logo.png")}
          style={s.logo}
          contentFit="contain"
          cachePolicy="disk"
          transition={0}
          priority="high"
          accessibilityLabel="Origins of the Elements logo"
        />

        <Text style={s.title}>ORIGINS OF THE</Text>
        <Text style={s.title}>ELEMENTS</Text>

        <View style={s.buttonContainer}>
          <TouchableOpacity
            style={s.playButton}
            onPress={() => {
              playSfx("start");
              startGame();
            }}
            accessibilityRole="button"
            accessibilityLabel="Start Mission"
          >
            <Text style={s.playButtonText}>START MISSION</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.howToPlayButton}
            onPress={() => {
              playSfx("click");
              showHowToPlay();
            }}
            accessibilityRole="button"
            accessibilityLabel="How to Play"
          >
            <Text style={s.howToPlayButtonText}>HOW TO PLAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
