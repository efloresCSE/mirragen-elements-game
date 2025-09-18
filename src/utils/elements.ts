import { Dimensions, PixelRatio, Platform } from "react-native"

export type OriginId =
  | "big-bang"
  | "low-mass-stars"
  | "white-dwarf-supernova"
  | "radioactive-decay"
  | "cosmic-ray-fission"
  | "high-mass-stars"
  | "merging-neutron-stars"
  | "human-made"

export function isTabletDevice(): boolean {
  const { width } = Dimensions.get("window")
  const pixelDensity = PixelRatio.get()
  const isiPad = Platform.OS === "ios" && (Platform as any).isPad === true
  return isiPad || width > 950 || (width > 768 && pixelDensity < 3)
}

export const getOriginIcons = (atomicNumber: number): OriginId[] => {
  const iconMap: Record<number, OriginId[]> = {
    1: ["big-bang"],
    2: ["big-bang"],
    3: ["low-mass-stars"],
    4: ["cosmic-ray-fission"],
    5: ["cosmic-ray-fission"],
    6: ["low-mass-stars"],
    7: ["low-mass-stars"],
    8: ["high-mass-stars"],
    9: ["high-mass-stars"],
    10: ["high-mass-stars"],
    11: ["high-mass-stars"],
    12: ["high-mass-stars"],
    13: ["high-mass-stars"],
    14: ["high-mass-stars"],
    15: ["high-mass-stars"],
    16: ["high-mass-stars", "white-dwarf-supernova"],
    17: ["high-mass-stars"],
    18: ["high-mass-stars", "white-dwarf-supernova"],
    19: ["high-mass-stars"],
    20: ["high-mass-stars", "white-dwarf-supernova"],
    21: ["high-mass-stars"],
    22: ["white-dwarf-supernova"],
    23: ["white-dwarf-supernova"],
    24: ["white-dwarf-supernova"],
    25: ["white-dwarf-supernova"],
    26: ["white-dwarf-supernova"],
    27: ["white-dwarf-supernova"],
    28: ["white-dwarf-supernova"],
    29: ["high-mass-stars", "white-dwarf-supernova"],
    30: ["high-mass-stars", "white-dwarf-supernova"],
    31: ["high-mass-stars"],
    32: ["high-mass-stars"],
    33: ["high-mass-stars"],
    34: ["high-mass-stars"],
    35: ["high-mass-stars"],
    36: ["high-mass-stars"],
    37: ["high-mass-stars"],
    38: ["low-mass-stars"],
    39: ["low-mass-stars"],
    40: ["low-mass-stars"],
    41: ["low-mass-stars"],
    42: ["merging-neutron-stars", "low-mass-stars"],
    43: ["radioactive-decay"],
    44: ["merging-neutron-stars"],
    45: ["merging-neutron-stars"],
    46: ["merging-neutron-stars", "low-mass-stars"],
    47: ["merging-neutron-stars"],
    48: ["merging-neutron-stars", "low-mass-stars"],
    49: ["merging-neutron-stars"],
    50: ["merging-neutron-stars", "low-mass-stars"],
    51: ["merging-neutron-stars"],
    52: ["merging-neutron-stars", "low-mass-stars"],
    53: ["merging-neutron-stars"],
    54: ["merging-neutron-stars"],
    55: ["merging-neutron-stars"],
    56: ["low-mass-stars"],
    57: ["merging-neutron-stars", "low-mass-stars"],
    58: ["low-mass-stars"],
    59: ["merging-neutron-stars", "low-mass-stars"],
    60: ["merging-neutron-stars", "low-mass-stars"],
    61: ["radioactive-decay"],
    62: ["merging-neutron-stars"],
    63: ["merging-neutron-stars"],
    64: ["merging-neutron-stars"],
    65: ["merging-neutron-stars"],
    66: ["merging-neutron-stars"],
    67: ["merging-neutron-stars"],
    68: ["merging-neutron-stars"],
    69: ["merging-neutron-stars"],
    70: ["merging-neutron-stars"],
    71: ["merging-neutron-stars"],
    72: ["merging-neutron-stars", "high-mass-stars"],
    73: ["merging-neutron-stars", "high-mass-stars"],
    74: ["merging-neutron-stars", "high-mass-stars"],
    75: ["merging-neutron-stars"],
    76: ["merging-neutron-stars"],
    77: ["merging-neutron-stars"],
    78: ["merging-neutron-stars"],
    79: ["merging-neutron-stars"],
    80: ["merging-neutron-stars", "high-mass-stars"],
    81: ["low-mass-stars"],
    82: ["merging-neutron-stars", "low-mass-stars"],
    83: ["merging-neutron-stars"],
    84: ["radioactive-decay"],
    85: ["radioactive-decay"],
    86: ["radioactive-decay"],
    87: ["radioactive-decay"],
    88: ["radioactive-decay"],
    89: ["radioactive-decay"],
    90: ["merging-neutron-stars"],
    91: ["radioactive-decay"],
    92: ["merging-neutron-stars"],
    93: ["radioactive-decay"],
    94: ["merging-neutron-stars"],
    95: ["human-made"],
    96: ["human-made"],
    97: ["human-made"],
    98: ["human-made"],
    99: ["human-made"],
    100: ["human-made"],
    101: ["human-made"],
    102: ["human-made"],
    103: ["human-made"],
    104: ["human-made"],
    105: ["human-made"],
    106: ["human-made"],
    107: ["human-made"],
    108: ["human-made"],
    109: ["human-made"],
    110: ["human-made"],
    111: ["human-made"],
    112: ["human-made"],
    113: ["human-made"],
    114: ["human-made"],
    115: ["human-made"],
    116: ["human-made"],
    117: ["human-made"],
    118: ["human-made"],
  }
  return iconMap[atomicNumber] || ["high-mass-stars"]
}

export const getElementDescription = (atomicNumber: number): string => {
  const descriptions: Record<number, string> = {
    5: "is a known antimicrobial that has been linked to enhanced wound healing via release of growth factors and cytokines and increased turnover of extracellular matrix.",
    11: "has been shown to play a role in immune cell modulation of T cells and in regulating chemotaxis—macrophages migrate toward increasing salt concentrations.",
    12: "supports adhesion of keratinocytes to the extracellular matrix. It can also disrupt pathogens through reactive oxygen species, causing oxidative damage.",
    19: "plays an essential role in cell membrane hyperpolarization of epithelial cells. This polarization enables specialized epithelial functions.",
    20: "is involved in hemostasis, cell migration during wound healing, and as a signal transmitter. Calcium-mediated chemotaxis helps reduce microbial load and aids healing.",
  }
  return (
    descriptions[atomicNumber] ||
    "plays an important role in various biological processes and has unique properties that make it essential for life and technology."
  )
}

export const getDescriptionFontSize = (
  text: string,
  isTablet: boolean = isTabletDevice(),
): number => {
  const baseSize = isTablet ? 17 : 13
  const maxSize = isTablet ? 17 : 13
  const minSize = isTablet ? 15 : 11

  if (text.length > 450) return minSize
  if (text.length > 400) return minSize + 1
  if (text.length > 350) return minSize + 2
  return Math.min(maxSize, baseSize)
}
