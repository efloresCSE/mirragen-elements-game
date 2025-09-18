"use client"

import { useWindowDimensions } from "react-native"

export const useDeviceType = () => {
  const { width, height } = useWindowDimensions()

  // Since this is a landscape-only app, we can use width-based detection
  // iPhones in landscape: 667-932px wide
  // iPads in landscape: 1024-1366px+ wide
  const isTablet = width >= 1000

  return { isTablet, width, height }
}
