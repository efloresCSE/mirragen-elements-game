"use client";

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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        SourceSerifPro_400Regular,
        SourceSerifPro_600SemiBold,
        SourceSerifPro_700Bold,
    });

    useEffect(() => {
        // Minimal, reliable lock: LANDSCAPE only
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        // Optional: if device rotates, re-lock
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

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
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
