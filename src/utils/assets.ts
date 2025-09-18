export type OriginId =
  | "big-bang"
  | "low-mass-stars"
  | "high-mass-stars"
  | "white-dwarf-supernova"
  | "merging-neutron-stars"
  | "cosmic-ray-fission"
  | "radioactive-decay"
  | "human-made"

export const ORIGIN_ICON_SOURCES: Record<OriginId, number> = {
  "big-bang": require("../../assets/images/origin-icons/big-bang.png"),
  "low-mass-stars": require("../../assets/images/origin-icons/low-mass-stars.png"),
  "high-mass-stars": require("../../assets/images/origin-icons/high-mass-stars.png"),
  "white-dwarf-supernova": require("../../assets/images/origin-icons/white-dwarf-supernova.png"),
  "merging-neutron-stars": require("../../assets/images/origin-icons/merging-neutron-stars.png"),
  "cosmic-ray-fission": require("../../assets/images/origin-icons/cosmic-ray-fission.png"),
  "radioactive-decay": require("../../assets/images/origin-icons/radioactive-decay.png"),
  "human-made": require("../../assets/images/origin-icons/human-made.png"),
} as const

export type UiIconId = "hourglass" | "memory"

export const UI_ICON_SOURCES: Record<UiIconId, number> = {
  hourglass: require("../../assets/images/icons/hourglass.png"),
  memory: require("../../assets/images/icons/memoryicon.png"),
} as const

export async function preloadOriginIcons() {
  const { Asset } = await import("expo-asset")
  const modules = Object.values(ORIGIN_ICON_SOURCES) as number[]
  await Asset.loadAsync(modules)
}

export async function preloadUiIcons() {
  const { Asset } = await import("expo-asset")
  const modules = Object.values(UI_ICON_SOURCES) as number[]
  await Asset.loadAsync(modules)
}

export async function preloadAllStaticImages() {
  const { Asset } = await import("expo-asset")
  const modules = [
    ...Object.values(ORIGIN_ICON_SOURCES),
    ...Object.values(UI_ICON_SOURCES),
  ] as number[]
  await Asset.loadAsync(modules)
}
