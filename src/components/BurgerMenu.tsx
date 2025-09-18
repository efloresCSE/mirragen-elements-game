"use client";

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeTokens } from "../styles/theme";

type BurgerMenuProps = {
  onPress: () => void;
};

export default function BurgerMenu({ onPress }: BurgerMenuProps) {
  const { colors, isTablet } = useThemeTokens();
  const insets = useSafeAreaInsets();

  const SIZE = isTablet ? 40 : 30;   
  const HEIGHT = isTablet ? 32 : 24; 
  const THICK = isTablet ? 4 : 3;    
  const RADIUS = isTablet ? 3 : 2;   
  const OFFSET = 40;                 

  const bottom = OFFSET + Math.max(0, insets.bottom - 8);
  const left = OFFSET + Math.max(0, insets.left - 8);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: SIZE, height: HEIGHT, bottom, left }]}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      activeOpacity={0.8}
    >
      <View style={[styles.line, { width: SIZE, height: THICK, borderRadius: RADIUS, backgroundColor: colors.text }]} />
      <View style={[styles.line, { width: SIZE, height: THICK, borderRadius: RADIUS, backgroundColor: colors.text }]} />
      <View style={[styles.line, { width: SIZE, height: THICK, borderRadius: RADIUS, backgroundColor: colors.text }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
  },
  line: {},
});
