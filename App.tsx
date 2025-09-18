"use client";

// MUST BE FIRST
import "react-native-gesture-handler";
import "react-native-reanimated";

import {
    SourceSerifPro_400Regular,
    SourceSerifPro_600SemiBold,
    SourceSerifPro_700Bold,
    useFonts,
} from "@expo-google-fonts/source-serif-pro";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "./src/context/GameContext";
import GameScreen from "./src/screens/GameScreen";
import { initAudio } from "./src/utils/audio";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    SourceSerifPro_400Regular,
    SourceSerifPro_600SemiBold,
    SourceSerifPro_700Bold,
  });

  // Init audio and set volumes (swoosh at 50%)
  useEffect(() => {
    (async () => {
      await initAudio();
    })();
  }, []);

  // Lock to landscape and keep it locked
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    const sub = ScreenOrientation.addOrientationChangeListener((e) => {
      const o = e.orientationInfo.orientation;
      if (
        o === ScreenOrientation.Orientation.PORTRAIT_UP ||
        o === ScreenOrientation.Orientation.PORTRAIT_DOWN
      ) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    });
    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, []);

  // Hide splash when fonts are ready
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <GameScreen />
      </GameProvider>
    </GestureHandlerRootView>
  );
}
