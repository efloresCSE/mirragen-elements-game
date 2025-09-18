"use client";

import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ImageSourcePropType,
} from "react-native";
import { getSourceSerifFont } from "../styles/globalStyles";
import { useThemeTokens } from "../styles/theme";
import type { Element } from "../types/game";
import {
    getDescriptionFontSize,
    getElementDescription,
    getOriginIcons,
    type OriginId,
} from "../utils/elements";

type ElementCardProps = {
  element: Element;
  onSelect: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCount: number;
  isActive?: boolean;
  isPreview?: boolean;
};

export default function ElementCard({
  element,
  onSelect,
  isActive = true,
  isPreview = false,
}: ElementCardProps) {
  const { colors, borderRadius, shadows, isTablet } = useThemeTokens();

  const originIcons = getOriginIcons(element.atomicNumber);
  const description = getElementDescription(element.atomicNumber);
  const fullDescription = `${element.name} ${description}`;
  const descFontSize = getDescriptionFontSize(fullDescription, isTablet);

  const iconSources: Record<OriginId, ImageSourcePropType> = useMemo(
    () => ({
      "big-bang": require("../../assets/images/origin-icons/big-bang.png"),
      "low-mass-stars": require("../../assets/images/origin-icons/low-mass-stars.png"),
      "high-mass-stars": require("../../assets/images/origin-icons/high-mass-stars.png"),
      "white-dwarf-supernova": require("../../assets/images/origin-icons/white-dwarf-supernova.png"),
      "merging-neutron-stars": require("../../assets/images/origin-icons/merging-neutron-stars.png"),
      "cosmic-ray-fission": require("../../assets/images/origin-icons/cosmic-ray-fission.png"),
      "radioactive-decay": require("../../assets/images/origin-icons/radioactive-decay.png"),
      "human-made": require("../../assets/images/origin-icons/human-made.png"),
    }),
    [],
  );

  const s = useMemo(
    () =>
      StyleSheet.create({
        container: { width: isTablet ? 200 : 150, alignItems: "center" },
        card: {
          width: "100%",
          height: isTablet ? 320 : 240,
          borderRadius: borderRadius.md,
          padding: isTablet ? 22 : 16,
          alignItems: "flex-start",
          borderWidth: isTablet ? 1.5 : 1,
          borderColor: colors.border,
          ...shadows.medium,
          justifyContent: "space-between",
          overflow: "hidden",
        },
        previewCard: {
          height: isTablet ? 320 : 240,
          justifyContent: "flex-start",
          borderColor: colors.border,
          borderWidth: isTablet ? 1.5 : 1,
          overflow: "hidden",
        },
        topSection: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          marginBottom: isTablet ? 6 : 4,
        },
        largeSymbol: {
          fontSize: isTablet ? 48 : 36,
          fontWeight: "bold",
          fontFamily: getSourceSerifFont("bold"),
          color: colors.text,
          lineHeight: isTablet ? 48 : 36,
        },
        topRightIconContainer: {
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          gap: isTablet ? 6 : 4,
        },
        originIcon: {
          width: isTablet ? 42 : 32,
          height: isTablet ? 42 : 32,
          borderRadius: isTablet ? 21 : 16,
        },
        name: {
          fontSize: isTablet ? 18 : 14,
          fontWeight: "600",
          fontFamily: getSourceSerifFont("semibold"),
          color: colors.text,
          alignSelf: "flex-start",
          marginBottom: isTablet ? 12 : 8,
          marginTop: isTablet ? -3 : -2,
        },
        descriptionContainer: {
          height: isTablet ? 140 : 100,
          width: "100%",
          marginBottom: isTablet ? 12 : 8,
          justifyContent: "flex-start",
        },
        description: {
          fontFamily: getSourceSerifFont("regular"),
          color: colors.textSecondary,
          lineHeight: isTablet ? 18 : 14,
          textAlign: "center",
          flex: 1,
        },
        elementNameInText: {
          fontWeight: "600",
          fontFamily: getSourceSerifFont("semibold"),
          color: colors.text,
        },
        selectButton: {
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          paddingHorizontal: isTablet ? 22 : 16,
          paddingVertical: isTablet ? 8 : 6,
          borderRadius: borderRadius.sm,
          alignSelf: "center",
          minWidth: isTablet ? 90 : 70,
          alignItems: "center",
        },
        selectButtonText: {
          color: colors.text,
          fontSize: isTablet ? 14 : 11,
          fontWeight: "400",
          fontFamily: getSourceSerifFont("regular"),
          letterSpacing: isTablet ? 0.7 : 0.5,
        },
      }),
    [isTablet, borderRadius, colors, shadows],
  );

  const renderOriginIcons = () => (
    <View style={s.topRightIconContainer}>
      {originIcons.map((id: OriginId, idx: number) => {
        const src = iconSources[id];
        if (!src) return null;
        return <Image key={`${id}-${idx}`} source={src} style={s.originIcon} resizeMode="contain" />;
      })}
    </View>
  );

  return (
    <View style={s.container}>
      <BlurView intensity={20} tint="dark" style={[s.card, isPreview && s.previewCard]}>
        {!isPreview && (
          <>
            <View style={s.topSection}>
              <Text style={s.largeSymbol}>{element.symbol}</Text>
              {renderOriginIcons()}
            </View>

            <Text style={s.name}>{element.name}</Text>

            {isActive && (
              <View style={s.descriptionContainer}>
                <Text
                  style={[s.description, { fontSize: descFontSize }]}
                  numberOfLines={isTablet ? 8 : 6}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  <Text style={[s.elementNameInText, { fontSize: descFontSize }]}>{element.name} </Text>
                  {description}
                </Text>
              </View>
            )}

            {isActive && (
              <TouchableOpacity style={s.selectButton} onPress={onSelect} accessibilityRole="button" accessibilityLabel="Select element">
                <Text style={s.selectButtonText}>Select</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </BlurView>
    </View>
  );
}
