import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import React, { useEffect, useState } from "react"
import { preloadAllStaticImages } from "../src/utils/assets"
import { initAudio, preloadSfx, primeSfx } from "../src/utils/audio"

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await initAudio()
        await preloadSfx([
          "click",
          "clickAlt",
          "press",
          "pressBig",
          "start",
          "success",
          "fail",
          "info",
          "infoSciFi",
          "swoosh",
          "zap",
        ])
        await primeSfx(["click", "press", "swoosh"])

        await preloadAllStaticImages()
      } finally {
        if (mounted) {
          setReady(true)
          SplashScreen.hideAsync().catch(() => {})
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
