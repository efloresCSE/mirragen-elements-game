import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av"

const SFX: Record<string, any> = {
  click: require("../../assets/sound/button_click.wav"),
  clickAlt: require("../../assets/sound/button_click_var2.wav"),
  press: require("../../assets/sound/button_press_release.wav"),
  pressBig: require("../../assets/sound/button_press_release_large.wav"),
  start: require("../../assets/sound/start_game_button.wav"),
  success: require("../../assets/sound/game_complete.wav"),
  fail: require("../../assets/sound/game_over.wav"),
  info: require("../../assets/sound/info_pop.wav"),
  infoSciFi: require("../../assets/sound/info_pop_scifi.wav"),
  swoosh: require("../../assets/sound/swipe_dynamic.wav"),
  zap: require("../../assets/sound/futurama_zap.wav"),
}
export type SfxName = keyof typeof SFX

const registry = new Map<string, Audio.Sound>() 
const loadingPromises = new Map<string, Promise<Audio.Sound>>() 
const volumeOverrides = new Map<string, number>() 
const lastPlayedAt = new Map<string, number>() 
const failedSounds = new Set<string>() 
const DEFAULT_THROTTLE_MS = 150

let audioModeConfigured = false
let audioEnabled = true 

function keyFor(source: any) {
  return typeof source === "number" ? String(source) : String(source ?? "")
}
function nameToKey(name: string) {
  const src = SFX[name]
  return src ? keyFor(src) : undefined
}

async function ensureAudioMode() {
  if (audioModeConfigured) return
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    })
    audioModeConfigured = true
  } catch (e) {
    console.warn("Audio mode setup failed:", e)
    audioEnabled = false
  }
}

async function ensureLoaded(source: any): Promise<Audio.Sound | null> {
  if (!audioEnabled) return null

  const key = keyFor(source)

  if (failedSounds.has(key)) {
    return null
  }

  const existing = registry.get(key)
  if (existing) {
    try {
      const status = await existing.getStatusAsync()
      if (status.isLoaded) return existing
    } catch {
      registry.delete(key)
    }
  }

  const inFlight = loadingPromises.get(key)
  if (inFlight) {
    try {
      return await inFlight
    } catch {
      return null
    }
  }

  const sound = existing ?? new Audio.Sound()
  if (!existing) registry.set(key, sound)

  const loadPromise = (async () => {
    try {
      const vol = volumeOverrides.get(key) ?? 1
      await sound.loadAsync(
        source,
        {
          shouldPlay: false,
          volume: vol,
          isLooping: false,
          isMuted: false,
          rate: 1.0,
          shouldCorrectPitch: true,
        },
        false,
      )
      return sound
    } catch (error) {
      console.warn(`Failed to load sound ${key}:`, error)
      failedSounds.add(key)
      registry.delete(key)
      throw error
    }
  })()

  loadingPromises.set(key, loadPromise)
  try {
    const loaded = await loadPromise
    return loaded
  } catch {
    return null
  } finally {
    loadingPromises.delete(key)
  }
}

export async function initAudio() {
  try {
    await ensureAudioMode()
    const commonSounds = ["click", "press", "start"] as SfxName[]
    await Promise.allSettled(commonSounds.map((n) => preloadSfx(n)))
  } catch (e) {
    console.warn("Audio initialization failed:", e)
    audioEnabled = false
  }
}

export async function preloadSfx(nameOrNames: SfxName | SfxName[]) {
  if (!audioEnabled) return

  await ensureAudioMode()
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  await Promise.allSettled(
    names.map(async (n) => {
      const src = SFX[n]
      if (!src) return
      try {
        await ensureLoaded(src)
      } catch (e) {
        console.warn(`preloadSfx error for ${n}:`, e)
      }
    }),
  )
}

export async function primeSfx(names: SfxName[] = ["click"]) {
  if (!audioEnabled) return
  await ensureAudioMode()

  await Promise.allSettled(
    names.map(async (n) => {
      const src = SFX[n]
      if (!src) return
      const sound = await ensureLoaded(src)
      if (!sound) return
      const key = keyFor(src)
      const priorVol = volumeOverrides.get(key) ?? 1
      try {
        await sound.setVolumeAsync(0)
        await sound.playFromPositionAsync(0)
        await sound.stopAsync()
      } catch (e) {
        console.warn("primeSfx error:", e)
      } finally {
        try {
          await sound.setVolumeAsync(priorVol)
        } catch {}
      }
    }),
  )
}

export async function playSound(source: any, throttleMs: number = DEFAULT_THROTTLE_MS) {
  if (!audioEnabled) return

  await ensureAudioMode()
  const key = keyFor(source)

  const now = Date.now()
  const last = lastPlayedAt.get(key) ?? 0
  if (now - last < throttleMs) return
  lastPlayedAt.set(key, now)

  try {
    const sound = await ensureLoaded(source)
    if (!sound) return 

    const status = await sound.getStatusAsync()
    if (!status.isLoaded) {
      console.warn(`Sound ${key} is not loaded, skipping playback`)
      return
    }

    const vol = volumeOverrides.get(key)
    if (typeof vol === "number") {
      await sound.setVolumeAsync(Math.max(0, Math.min(1, vol)))
    }

    await sound.replayAsync()
  } catch (e) {
    console.warn(`playSound error for ${key}:`, e)
    failedSounds.add(key)
  }
}

export async function playSfx(name: SfxName, throttleMs: number = DEFAULT_THROTTLE_MS) {
  if (!audioEnabled) return

  const src = SFX[name]
  if (!src) {
    console.warn(`playSfx: unknown "${name}"`)
    return
  }
  await playSound(src, throttleMs)
}

export async function setSfxVolume(name: SfxName, volume: number) {
  if (!audioEnabled) return

  const key = nameToKey(name)
  if (!key) return
  const vol = Math.max(0, Math.min(1, Number(volume)))
  volumeOverrides.set(key, vol)
  const sound = registry.get(key)
  if (sound) {
    try {
      const status = await sound.getStatusAsync()
      if (status.isLoaded) {
        await sound.setVolumeAsync(vol)
      }
    } catch (e) {
      console.warn(`setSfxVolume error for ${name}:`, e)
    }
  }
}

export async function pauseAll() {
  const sounds = Array.from(registry.values())
  await Promise.allSettled(
    sounds.map(async (s) => {
      try {
        const status = await s.getStatusAsync()
        if (status.isLoaded) {
          await s.pauseAsync()
        }
      } catch {}
    }),
  )
}

export async function unloadAll() {
  const sounds = Array.from(registry.values())
  await Promise.allSettled(
    sounds.map(async (s) => {
      try {
        await s.unloadAsync()
      } catch {}
    }),
  )
  registry.clear()
  loadingPromises.clear()
  lastPlayedAt.clear()
  failedSounds.clear()
}

export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled
  if (!enabled) {
    unloadAll()
  }
}

export function isAudioEnabled() {
  return audioEnabled
}
