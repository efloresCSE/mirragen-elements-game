"use client"

import type React from "react"
import { useMemo, useRef } from "react"
import { Dimensions, PixelRatio, StyleSheet, View } from "react-native"
import Svg, { Line } from "react-native-svg"
import { useGame } from "../context/GameContext"
import { PERIODIC_TABLE_DATA } from "../data/elements"
import { useThemeTokens } from "../styles/theme"
import ElementCell from "./ElementCell"

const COLUMNS = 18
const ROWS_MAIN = 7
const LANTHANIDE_ACTINIDE_ROWS = 2

const roundDP = (n: number) => PixelRatio.roundToNearestPixel(n)

function computeCellSize(tbl: any, width: number, height: number): number {
  const reservedRight = tbl?.reservedRight ?? 0
  const reservedVertical = tbl?.reservedVertical ?? 0

  const availableWidth = width - reservedRight
  const availableHeight = height - reservedVertical

  const cellFromWidth = availableWidth / COLUMNS
  const cellFromHeight = availableHeight / (ROWS_MAIN + LANTHANIDE_ACTINIDE_ROWS)
  const raw = Math.min(cellFromWidth, cellFromHeight)

  const min = tbl?.cellMin ?? 18
  const max = tbl?.cellMax ?? 48
  const clamped = Math.max(min, Math.min(raw, max))

  return roundDP(clamped)
}

export default function PeriodicTable() {
  const { gameState } = useGame()
  const { table } = useThemeTokens()

  const initialDims = useRef(() => {
    const win = Dimensions.get("window") 
    const w = Math.max(win.width, win.height)   
    const h = Math.min(win.width, win.height)   
    return { w, h }
  }).current()

  const tableRef = useRef(table)

  const cellSize = useMemo(
    () => computeCellSize(tableRef.current, initialDims.w, initialDims.h),
    [initialDims.w, initialDims.h],
  )

  const all = PERIODIC_TABLE_DATA

  const grid: ((typeof all)[number] | null)[][] = Array(ROWS_MAIN)
    .fill(null)
    .map(() => Array(COLUMNS).fill(null))

  all.forEach((el) => {
    if (el.row >= 1 && el.row <= ROWS_MAIN && el.col >= 1 && el.col <= COLUMNS) {
      grid[el.row - 1][el.col - 1] = el
    }
  })

  const lanthanides = all.filter((el) => el.row === 9)
  const actinides = all.filter((el) => el.row === 10)

  const lanthanideGrid: ((typeof all)[number] | null)[] = Array(COLUMNS).fill(null)
  lanthanides.forEach((el) => {
    const newCol = el.col + 1
    if (newCol >= 1 && newCol <= COLUMNS) lanthanideGrid[newCol - 1] = el
  })

  const actinideGrid: ((typeof all)[number] | null)[] = Array(COLUMNS).fill(null)
  actinides.forEach((el) => {
    const newCol = el.col + 1
    if (newCol >= 1 && newCol <= COLUMNS) actinideGrid[newCol - 1] = el
  })

  const cellExists = (row: number, col: number) =>
    !(row < 0 || row >= ROWS_MAIN || col < 0 || col >= COLUMNS) && grid[row][col] !== null
  const lanthanideExists = (col: number) => lanthanideGrid[col] !== null
  const actinideExists = (col: number) => actinideGrid[col] !== null

  const renderSharedCornerBorders = () => {
    const current = cellSize
    const corner = current * 0.3
    const stroke = "#FFFFFF"
    const strokeW = 0.4
    const lines: React.ReactNode[] = []
    let k = 0

    for (let r = 0; r < ROWS_MAIN; r++) {
      for (let c = 0; c < COLUMNS; c++) {
        if (!cellExists(r, c)) continue
        const x = c * current
        const y = r * current
        const right = cellExists(r, c + 1)
        const bottom = cellExists(r + 1, c)
        const lanthBelow = r === 6 && lanthanideExists(c)

        lines.push(<Line key={`${k++}`} x1={x} y1={y} x2={x + corner} y2={y} stroke={stroke} strokeWidth={strokeW} />)
        lines.push(<Line key={`${k++}`} x1={x} y1={y} x2={x} y2={y + corner} stroke={stroke} strokeWidth={strokeW} />)

        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current - corner}
            y1={y}
            x2={x + current}
            y2={y}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
        if (!right) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current}
              y1={y}
              x2={x + current}
              y2={y + corner}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }

        // BL
        lines.push(
          <Line
            key={`${k++}`}
            x1={x}
            y1={y + current - corner}
            x2={x}
            y2={y + current}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
        if (!bottom || lanthBelow) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x}
              y1={y + current}
              x2={x + corner}
              y2={y + current}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }

        if (!right) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current}
              y1={y + current - corner}
              x2={x + current}
              y2={y + current}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }
        if (!bottom || lanthBelow) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current - corner}
              y1={y + current}
              x2={x + current}
              y2={y + current}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }

        // Connectors
        if (right) {
          const xR = (c + 1) * current
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current - corner}
              y1={y}
              x2={xR + corner}
              y2={y}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
          if ((!bottom || lanthBelow) && !cellExists(r + 1, c + 1)) {
            lines.push(
              <Line
                key={`${k++}`}
                x1={x + current - corner}
                y1={y + current}
                x2={xR + corner}
                y2={y + current}
                stroke={stroke}
                strokeWidth={strokeW}
              />,
            )
          }
        }

        if (bottom) {
          const yB = (r + 1) * current
          lines.push(
            <Line
              key={`${k++}`}
              x1={x}
              y1={y + current - corner}
              x2={x}
              y2={yB + corner}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
          if (!right && !cellExists(r + 1, c + 1)) {
            lines.push(
              <Line
                key={`${k++}`}
                x1={x + current}
                y1={y + current - corner}
                x2={x + current}
                y2={yB + corner}
                stroke={stroke}
                strokeWidth={strokeW}
              />,
            )
          }
        }

        if (lanthBelow) {
          const yL = ROWS_MAIN * current
          lines.push(
            <Line
              key={`${k++}`}
              x1={x}
              y1={y + current - corner}
              x2={x}
              y2={yL + corner}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
          if (!right) {
            lines.push(
              <Line
                key={`${k++}`}
                x1={x + current}
                y1={y + current - corner}
                x2={x + current}
                y2={yL + corner}
                stroke={stroke}
                strokeWidth={strokeW}
              />,
            )
          }
        }
      }
    }

    const yLRow = ROWS_MAIN * current
    for (let c = 0; c < COLUMNS; c++) {
      if (!lanthanideExists(c)) continue
      const x = c * current
      const y = yLRow
      const right = lanthanideExists(c + 1)
      const mainAbove = cellExists(6, c)
      const actBelow = actinideExists(c)
      const isLu = lanthanideGrid[c]?.atomicNumber === 71

      if (!mainAbove) {
        lines.push(<Line key={`${k++}`} x1={x} y1={y} x2={x + corner} y2={y} stroke={stroke} strokeWidth={strokeW} />)
      }
      lines.push(<Line key={`${k++}`} x1={x} y1={y} x2={x} y2={y + corner} stroke={stroke} strokeWidth={strokeW} />)

      if (!mainAbove) {
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current - corner}
            y1={y}
            x2={x + current}
            y2={y}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }
      if (!right || isLu) {
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current}
            y1={y}
            x2={x + current}
            y2={y + corner}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }

      lines.push(
        <Line
          key={`${k++}`}
          x1={x}
          y1={y + current - corner}
          x2={x}
          y2={y + current}
          stroke={stroke}
          strokeWidth={strokeW}
        />,
      )
      lines.push(
        <Line
          key={`${k++}`}
          x1={x}
          y1={y + current}
          x2={x + corner}
          y2={y + current}
          stroke={stroke}
          strokeWidth={strokeW}
        />,
      )

      if (!right || isLu) {
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current}
            y1={y + current - corner}
            x2={x + current}
            y2={y + current}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }
      lines.push(
        <Line
          key={`${k++}`}
          x1={x + current - corner}
          y1={y + current}
          x2={x + current}
          y2={y + current}
          stroke={stroke}
          strokeWidth={strokeW}
        />,
      )

      if (right) {
        const xR = (c + 1) * current
        if (!mainAbove && !cellExists(6, c + 1)) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current - corner}
              y1={y}
              x2={xR + corner}
              y2={y}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current - corner}
            y1={y + current}
            x2={xR + corner}
            y2={y + current}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }

      if (actBelow) {
        const yA = yLRow + current
        lines.push(
          <Line
            key={`${k++}`}
            x1={x}
            y1={y + current - corner}
            x2={x}
            y2={yA + corner}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
        if (!right || isLu) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current}
              y1={y + current - corner}
              x2={x + current}
              y2={yA + corner}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }
      }
    }

    const yARow = yLRow + current
    for (let c = 0; c < COLUMNS; c++) {
      if (!actinideExists(c)) continue
      const x = c * current
      const y = yARow
      const right = actinideExists(c + 1)
      const lanthAbove = lanthanideExists(c)
      const isLr = actinideGrid[c]?.atomicNumber === 103

      if (!lanthAbove) {
        lines.push(<Line key={`${k++}`} x1={x} y1={y} x2={x + corner} y2={y} stroke={stroke} strokeWidth={strokeW} />)
      }
      lines.push(<Line key={`${k++}`} x1={x} y1={y} x2={x} y2={y + corner} stroke={stroke} strokeWidth={strokeW} />)

      if (!lanthAbove) {
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current - corner}
            y1={y}
            x2={x + current}
            y2={y}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }
      if (!right || isLr) {
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current}
            y1={y}
            x2={x + current}
            y2={y + corner}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }

      lines.push(
        <Line
          key={`${k++}`}
          x1={x}
          y1={y + current - corner}
          x2={x}
          y2={y + current}
          stroke={stroke}
          strokeWidth={strokeW}
        />,
      )
      lines.push(
        <Line
          key={`${k++}`}
          x1={x}
          y1={y + current}
          x2={x + corner}
          y2={y + current}
          stroke={stroke}
          strokeWidth={strokeW}
        />,
      )

      if (!right || isLr) {
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current}
            y1={y + current - corner}
            x2={x + current}
            y2={y + current}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }
      lines.push(
        <Line
          key={`${k++}`}
          x1={x + current - corner}
          y1={y + current}
          x2={x + current}
          y2={y + current}
          stroke={stroke}
          strokeWidth={strokeW}
        />,
      )

      if (right) {
        const xR = (c + 1) * current
        if (!lanthAbove && !lanthanideExists(c + 1)) {
          lines.push(
            <Line
              key={`${k++}`}
              x1={x + current - corner}
              y1={y}
              x2={xR + corner}
              y2={y}
              stroke={stroke}
              strokeWidth={strokeW}
            />,
          )
        }
        lines.push(
          <Line
            key={`${k++}`}
            x1={x + current - corner}
            y1={y + current}
            x2={xR + corner}
            y2={y + current}
            stroke={stroke}
            strokeWidth={strokeW}
          />,
        )
      }
    }

    return lines
  }

  const renderRow = (row: ((typeof all)[number] | null)[], key: string) => (
    <View key={key} style={styles.row}>
      {row.map((element, idx) => (
        <ElementCell
          key={`${key}-${idx}`}
          element={element}
          isTarget={!!element && gameState.targetElements.some((t) => t.atomicNumber === element.atomicNumber)}
          isCorrect={!!element && gameState.correctPlacements.includes(element.atomicNumber)}
          isHighlighted={
            !!element &&
            !!gameState.currentHighlightedPosition &&
            element.row === gameState.currentHighlightedPosition.row &&
            element.col === gameState.currentHighlightedPosition.col
          }
          gamePhase={gameState.phase}
          onPress={() => {}}
          cellSize={cellSize}
        />
      ))}
    </View>
  )

  const tableWidth = COLUMNS * cellSize
  const tableHeight = (ROWS_MAIN + LANTHANIDE_ACTINIDE_ROWS) * cellSize

  return (
    <View style={styles.wrapper}>
      <View style={styles.tableContainer}>
        <Svg width={tableWidth} height={tableHeight} style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {renderSharedCornerBorders()}
        </Svg>
        {grid.map((row, i) => renderRow(row, `main-${i}`))}
        {}
        <View style={styles.row}>
          {Array.from({ length: COLUMNS }).map((_, idx) => (
            <ElementCell
              key={`lanth-${idx}`}
              element={lanthanideGrid[idx]}
              isTarget={!!lanthanideGrid[idx] && gameState.targetElements.some((t) => t.atomicNumber === lanthanideGrid[idx]!.atomicNumber)}
              isCorrect={!!lanthanideGrid[idx] && gameState.correctPlacements.includes(lanthanideGrid[idx]!.atomicNumber)}
              isHighlighted={
                !!lanthanideGrid[idx] &&
                !!gameState.currentHighlightedPosition &&
                lanthanideGrid[idx]!.row === gameState.currentHighlightedPosition.row &&
                lanthanideGrid[idx]!.col === gameState.currentHighlightedPosition.col
              }
              gamePhase={gameState.phase}
              onPress={() => {}}
              cellSize={cellSize}
            />
          ))}
        </View>
        <View style={styles.row}>
          {Array.from({ length: COLUMNS }).map((_, idx) => (
            <ElementCell
              key={`act-${idx}`}
              element={actinideGrid[idx]}
              isTarget={!!actinideGrid[idx] && gameState.targetElements.some((t) => t.atomicNumber === actinideGrid[idx]!.atomicNumber)}
              isCorrect={!!actinideGrid[idx] && gameState.correctPlacements.includes(actinideGrid[idx]!.atomicNumber)}
              isHighlighted={
                !!actinideGrid[idx] &&
                !!gameState.currentHighlightedPosition &&
                actinideGrid[idx]!.row === gameState.currentHighlightedPosition.row &&
                actinideGrid[idx]!.col === gameState.currentHighlightedPosition.col
              }
              gamePhase={gameState.phase}
              onPress={() => {}}
              cellSize={cellSize}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  tableContainer: {
    alignItems: "center",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
})
