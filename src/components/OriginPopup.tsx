"use client"

import { BlurView } from "expo-blur"
import React, { useEffect, useMemo, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getSourceSerifFont } from "../styles/globalStyles"
import { useThemeTokens } from "../styles/theme"
import { playSfx } from "../utils/audio"

interface OriginPopupProps {
  visible: boolean
  onClose: () => void
  onHowToPlay: () => void
}

const originData = [
  { icon: require("../../assets/images/origin-icons/big-bang.png"), title: "The big", subtitle: "bang" },
  { icon: require("../../assets/images/origin-icons/low-mass-stars.png"), title: "Dying low", subtitle: "mass stars" },
  { icon: require("../../assets/images/origin-icons/white-dwarf-supernova.png"), title: "White dwarf", subtitle: "supernova" },
  { icon: require("../../assets/images/origin-icons/radioactive-decay.png"), title: "Radioactive", subtitle: "decay" },
  { icon: require("../../assets/images/origin-icons/cosmic-ray-fission.png"), title: "Cosmic ray", subtitle: "collision" },
  { icon: require("../../assets/images/origin-icons/high-mass-stars.png"), title: "Dying high-mass", subtitle: "stars" },
  { icon: require("../../assets/images/origin-icons/merging-neutron-stars.png"), title: "Merging", subtitle: "neutron stars" },
  { icon: require("../../assets/images/origin-icons/human-made.png"), title: "Human-made", subtitle: "" },
]

export default function OriginPopup({ visible, onClose, onHowToPlay }: OriginPopupProps) {
  const { colors, borderRadius, spacing, fontSize, width, height, isTablet } = useThemeTokens()
  const [showReferences, setShowReferences] = useState(false)
  const [wasVisible, setWasVisible] = useState(false)

  useEffect(() => {
    if (visible && !wasVisible) {
      setShowReferences(false)
      playSfx("click")
      setWasVisible(true)
    } else if (!visible && wasVisible) {
      setWasVisible(false)
    }
  }, [visible, wasVisible])

  const handleClose = () => {
    playSfx("clickAlt")
    onClose()
  }
  const handleBackButton = () => {
    playSfx("clickAlt")
    onClose()
  }
  const handleInfoClick = () => setShowReferences(true)
  const handleBackToMain = () => setShowReferences(false)
  const handleHowToPlay = () => {
    playSfx("click")
    onHowToPlay()
  }

  const containerWidth = useMemo(
    () => (isTablet ? Math.min(width * 0.8, 700) : Math.min(width * 0.65, 480)),
    [width, isTablet],
  )
  const containerMinHeight = useMemo(() => (isTablet ? height * 0.7 : height * 0.5), [height, isTablet])
  const iconSize = isTablet ? 50 : 36
  const iconTitleFS = isTablet ? 14 : 11
  const headerTitleFS = isTablet ? 28 : 20

  if (!visible) return null

  return (
    <TouchableOpacity style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={handleClose} activeOpacity={1}>
      <View style={[styles.popupContainer, { paddingRight: isTablet ? spacing.xxl : spacing.xl }]}>
        <BlurView intensity={20} tint="dark" style={[
          styles.popup,
          {
            borderRadius: borderRadius.lg,
            padding: isTablet ? spacing.xl : spacing.lg,
            width: containerWidth,
            minHeight: containerMinHeight,
            borderWidth: isTablet ? 2 : 1,
            borderColor: colors.border,
          },
        ]}>
          {}
          {!showReferences ? (
            <View style={[styles.header, { marginBottom: isTablet ? spacing.xxl : spacing.lg }]}>
              <TouchableOpacity
                style={{ paddingVertical: isTablet ? 8 : 4, paddingHorizontal: isTablet ? 12 : 8 }}
                onPress={handleBackButton}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: isTablet ? 16 : 12,
                    fontWeight: "500",
                    fontFamily: getSourceSerifFont("semibold"),
                    letterSpacing: isTablet ? 1.5 : 1,
                  }}
                >
                  BACK
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: headerTitleFS,
                  fontWeight: "600",
                  fontFamily: getSourceSerifFont("semibold"),
                  color: colors.text,
                  textAlign: "center",
                  letterSpacing: isTablet ? 1.5 : 1,
                  flex: 1,
                }}
              >
                Origins of the Elements
              </Text>

              <TouchableOpacity
                style={{ width: isTablet ? 80 : 60, alignItems: "flex-end", paddingVertical: isTablet ? 12 : 4, paddingHorizontal: isTablet ? 12 : 8 }}
                onPress={handleInfoClick}
              >
                <View
                  style={{
                    width: isTablet ? 32 : 24,
                    height: isTablet ? 32 : 24,
                    borderRadius: isTablet ? 16 : 12,
                    borderWidth: isTablet ? 1.5 : 1,
                    borderColor: colors.border,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: isTablet ? 18 : 14,
                      fontWeight: "400",
                      fontFamily: getSourceSerifFont("regular"),
                      fontStyle: "italic",
                    }}
                  >
                    i
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: "center", marginBottom: isTablet ? spacing.xxl : spacing.lg }}>
              <Text
                style={{
                  fontSize: headerTitleFS,
                  fontWeight: "600",
                  fontFamily: getSourceSerifFont("semibold"),
                  color: colors.text,
                  textAlign: "center",
                  letterSpacing: isTablet ? 1.5 : 1,
                }}
              >
                References
              </Text>
            </View>
          )}

          {}
          {!showReferences ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  marginBottom: isTablet ? spacing.xl : spacing.lg,
                  paddingHorizontal: isTablet ? spacing.md : 0,
                }}
              >
                {originData.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: isTablet ? "23%" : "22%",
                      alignItems: "center",
                      marginBottom: isTablet ? 35 : 20,
                    }}
                  >
                    <Image source={item.icon} style={{ width: iconSize, height: iconSize, marginBottom: isTablet ? 10 : 6 }} resizeMode="contain" />
                    <Text
                      style={{
                        fontSize: iconTitleFS,
                        fontFamily: getSourceSerifFont("semibold"),
                        color: colors.text,
                        textAlign: "center",
                        fontWeight: "500",
                        lineHeight: isTablet ? 16 : 13,
                      }}
                    >
                      {item.title}
                    </Text>
                    {!!item.subtitle && (
                      <Text
                        style={{
                          fontSize: iconTitleFS,
                          fontFamily: getSourceSerifFont("regular"),
                          color: colors.text,
                          textAlign: "center",
                          fontWeight: "400",
                          lineHeight: isTablet ? 16 : 13,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={{ alignSelf: "center", paddingVertical: isTablet ? 12 : 8, paddingHorizontal: isTablet ? 16 : 0 }}
                onPress={handleHowToPlay}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: isTablet ? fontSize.lg : 13,
                    fontWeight: "400",
                    fontFamily: getSourceSerifFont("regular"),
                    letterSpacing: isTablet ? 1.5 : 1,
                    textDecorationLine: "underline",
                  }}
                >
                  HOW TO PLAY
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  paddingVertical: isTablet ? 30 : 20,
                  paddingHorizontal: isTablet ? 30 : 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {[
                  "1. Lansdown, Alan. Calcium: a potential central regulator in wound healing in the skin. Wound Repair and Regeneration, 2002.",
                  "2. Demidov-Orlov, M., et al. Action of Boron at the Molecular Level. Biological Trace Element Research, 2019.",
                  "3. Coger, Vincent, et al. Tissue Concentrations of Zinc, Iron, Copper and Magnesium During the Phases of Wound Healing in a Rodent Model. Biological Trace Element Research, 2019.",
                  "4. Wick, Nicola, et al. The role of sodium in modulating immune cell function. Nature, 2019.",
                  "5. O'Grady, Sean M., et al. Molecular Diversity and Function of voltage-gated potassium channels in epithelial cells. International Journal of Biochemistry and Cell Biology, 2008.",
                ].map((txt, idx) => (
                  <Text
                    key={idx}
                    style={{
                      fontSize: isTablet ? 12 : 9,
                      fontFamily: getSourceSerifFont("regular"),
                      color: colors.text,
                      lineHeight: isTablet ? 16 : 12,
                      marginBottom: isTablet ? 15 : 10,
                      textAlign: "center",
                      paddingHorizontal: isTablet ? 15 : 10,
                    }}
                  >
                    {txt}
                  </Text>
                ))}
              </View>

              <TouchableOpacity
                style={{ alignSelf: "center", paddingVertical: isTablet ? 12 : 8, paddingHorizontal: isTablet ? 20 : 16 }}
                onPress={handleBackToMain}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: isTablet ? 16 : 12,
                    fontWeight: "500",
                    fontFamily: getSourceSerifFont("semibold"),
                    letterSpacing: isTablet ? 1.5 : 1,
                    textDecorationLine: "underline",
                  }}
                >
                  BACK
                </Text>
              </TouchableOpacity>
            </>
          )}
        </BlurView>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    inset: 0 as any, 
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
})
