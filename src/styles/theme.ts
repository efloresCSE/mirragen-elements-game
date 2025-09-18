"use client"

import { useMemo } from "react"
import { useDeviceType } from "../hooks/useDeviceType"

export const colors = {
  background: "#000000",
  text: "#FFFFFF",
  textSecondary: "#CCCCCC",
  textMuted: "#999999",
  accent: "#D4AF37",
  success: "#4CAF50",
  error: "#FF6B6B",
  warning: "#FFA726",
  border: "#FFFFFF",
  borderSecondary: "rgba(255, 255, 255, 0.3)",
  overlay: "rgba(0, 0, 0, 0.4)",

  hydrogen: "#FF6B6B",
  nobleGas: "#9B59B6",
  alkaliMetal: "#E74C3C",
  alkalineEarthMetal: "#F39C12",
  metalloid: "#F1C40F",
  nonmetal: "#2ECC71",
  halogen: "#3498DB",
  transitionMetal: "#E67E22",
  poorMetal: "#95A5A6",
  lanthanide: "#1ABC9C",
  actinide: "#16A085",
}

export const getGroupColor = (group: string) => {
  const map: Record<string, string> = {
    hydrogen: colors.hydrogen,
    "noble-gas": colors.nobleGas,
    "alkali-metal": colors.alkaliMetal,
    "alkaline-earth-metal": colors.alkalineEarthMetal,
    metalloid: colors.metalloid,
    nonmetal: colors.nonmetal,
    halogen: colors.halogen,
    "transition-metal": colors.transitionMetal,
    "poor-metal": colors.poorMetal,
    lanthanide: colors.lanthanide,
    actinide: colors.actinide,
  }
  return map[group] ?? colors.poorMetal
}

// ---- Reactive theme tokens (use inside React components)
export function useThemeTokens() {
  const { isTablet, width, height } = useDeviceType()

  const spacing = useMemo(
    () => ({
      xs: isTablet ? 6 : 4,
      sm: isTablet ? 12 : 8,
      md: isTablet ? 18 : 12,
      lg: isTablet ? 30 : 20,
      xl: isTablet ? 45 : 30,
      xxl: isTablet ? 80 : 60,
    }),
    [isTablet],
  )

  const fontSize = useMemo(
    () => ({
      xs: isTablet ? 12 : 10,
      sm: isTablet ? 16 : 12,
      md: isTablet ? 20 : 16,
      lg: isTablet ? 24 : 18,
      xl: isTablet ? 32 : 24,
      xxl: isTablet ? 48 : 32,
    }),
    [isTablet],
  )

  const borderRadius = useMemo(
    () => ({
      sm: isTablet ? 6 : 4,
      md: isTablet ? 16 : 12,
      lg: isTablet ? 20 : 16,
    }),
    [isTablet],
  )

  const shadows = useMemo(
    () => ({
      small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 15,
      },
      large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
      },
    }),
    [],
  )

  const table = useMemo(
    () => ({
      reservedRight: isTablet ? 80 : 140,
      reservedVertical: 0, 
      cellMin: isTablet ? 36 : 24, 
      cellMax: isTablet ? 70 : 40,
    }),
    [isTablet],
  )

  return { colors, spacing, fontSize, borderRadius, shadows, table, isTablet, width, height }
}
