"use client"

import React, { useLayoutEffect, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import Svg, { Line } from "react-native-svg"
import { useGame } from "../context/GameContext"
import { PERIODIC_TABLE_DATA } from "../data/elements"
import ElementCell from "./ElementCell"

const COLUMNS = 18
const ROWS_MAIN = 7
const LANTHANIDE_ACTINIDE_ROWS = 2

// Calculate cell size to use much more of the screen width
const getOptimalCellSize = () => {
    const { width, height } = Dimensions.get("window")
    const reservedHorizontalSpace = 240 // Reserve space for cards and wheel indicator on the right
    const reservedVerticalSpace = height * 0.15

    const availableWidth = width - reservedHorizontalSpace
    const availableHeight = height - reservedVerticalSpace

    const cellFromWidth = availableWidth / COLUMNS
    const cellFromHeight = availableHeight / (ROWS_MAIN + LANTHANIDE_ACTINIDE_ROWS)

    const calculatedSize = Math.min(cellFromWidth, cellFromHeight)
    return Math.max(35, Math.min(calculatedSize, 65))
}

// Calculate initial cell size immediately
const INITIAL_CELL_SIZE = getOptimalCellSize()

export default function PeriodicTable() {
    const { gameState } = useGame()
    // Initialize with the calculated size instead of using state
    const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE)
    const [dimensions, setDimensions] = useState(Dimensions.get("window"))

    // Update dimensions when screen rotates or changes
    useLayoutEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimensions(window)

            // Recalculate cell size
            const reservedHorizontalSpace = 240
            const reservedVerticalSpace = window.height * 0.15
            const availableWidth = window.width - reservedHorizontalSpace
            const availableHeight = window.height - reservedVerticalSpace

            const cellFromWidth = availableWidth / COLUMNS
            const cellFromHeight = availableHeight / (ROWS_MAIN + LANTHANIDE_ACTINIDE_ROWS)

            const calculatedSize = Math.min(cellFromWidth, cellFromHeight)
            const newCellSize = Math.max(35, Math.min(calculatedSize, 65))

            setCellSize(newCellSize)
        })

        return () => subscription?.remove()
    }, [])

    // Use the state cellSize instead of recalculating
    const currentCellSize = cellSize

    // Create full periodic table grid including ALL elements
    const allElements = PERIODIC_TABLE_DATA

    // Create main grid (7 rows x 18 columns) - include ALL main table elements
    const grid: ((typeof allElements)[number] | null)[][] = Array(ROWS_MAIN)
        .fill(null)
        .map(() => Array(COLUMNS).fill(null))

    // Place ALL elements in their correct positions (rows 1-7)
    allElements.forEach((el) => {
        if (el.row >= 1 && el.row <= ROWS_MAIN && el.col >= 1 && el.col <= COLUMNS) {
            grid[el.row - 1][el.col - 1] = el
        }
    })

    // Lanthanides & Actinides (separate rows) - create full 18-column grids
    const lanthanides = PERIODIC_TABLE_DATA.filter((el) => el.row === 9)
    const actinides = PERIODIC_TABLE_DATA.filter((el) => el.row === 10)

    // Create lanthanide grid (18 columns, positioned under Rf which is column 4)
    const lanthanideGrid: ((typeof allElements)[number] | null)[] = Array(COLUMNS).fill(null)
    lanthanides.forEach((el) => {
        const newCol = el.col + 1
        if (newCol >= 1 && newCol <= COLUMNS) {
            lanthanideGrid[newCol - 1] = el
        }
    })

    // Create actinide grid (18 columns, positioned under Rf which is column 4)
    const actinideGrid: ((typeof allElements)[number] | null)[] = Array(COLUMNS).fill(null)
    actinides.forEach((el) => {
        const newCol = el.col + 1
        if (newCol >= 1 && newCol <= COLUMNS) {
            actinideGrid[newCol - 1] = el
        }
    })

    // Function to check if a cell exists at given position
    const cellExists = (row: number, col: number) => {
        if (row < 0 || row >= ROWS_MAIN || col < 0 || col >= COLUMNS) return false
        return grid[row][col] !== null
    }

    // Function to check if a lanthanide exists at given column
    const lanthanideExists = (col: number) => {
        return lanthanideGrid[col] !== null
    }

    // Function to check if an actinide exists at given column
    const actinideExists = (col: number) => {
        return actinideGrid[col] !== null
    }

    // Function to render shared corner borders properly - UPDATED for no margins
    const renderSharedCornerBorders = () => {
        const cornerLength = currentCellSize * 0.3
        const borderColor = "#FFFFFF"
        const borderWidth = 0.4
        const lines = []
        let lineKey = 0

        // Main grid - each element draws its corners, with primary element responsible for shared segments
        for (let row = 0; row < ROWS_MAIN; row++) {
            for (let col = 0; col < COLUMNS; col++) {
                if (cellExists(row, col)) {
                    // Calculate the actual position of this cell - NO MARGINS
                    const cellX = col * currentCellSize
                    const cellY = row * currentCellSize

                    // Check for adjacent neighbors
                    const hasLeft = cellExists(row, col - 1)
                    const hasRight = cellExists(row, col + 1)
                    const hasTop = cellExists(row - 1, col)
                    const hasBottom = cellExists(row + 1, col)

                    // Special case: check if there's a lanthanide directly below this cell (for row 6)
                    const hasLanthanideBelow = row === 6 && lanthanideExists(col)

                    // TOP-LEFT CORNER
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX}
                            y1={cellY}
                            x2={cellX + cornerLength}
                            y2={cellY}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX}
                            y1={cellY}
                            x2={cellX}
                            y2={cellY + cornerLength}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )

                    // TOP-RIGHT CORNER
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize - cornerLength}
                            y1={cellY}
                            x2={cellX + currentCellSize}
                            y2={cellY}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                    if (!hasRight) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize}
                                y1={cellY}
                                x2={cellX + currentCellSize}
                                y2={cellY + cornerLength}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }

                    // BOTTOM-LEFT CORNER
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX}
                            y1={cellY + currentCellSize - cornerLength}
                            x2={cellX}
                            y2={cellY + currentCellSize}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                    if (!hasBottom || hasLanthanideBelow) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX}
                                y1={cellY + currentCellSize}
                                x2={cellX + cornerLength}
                                y2={cellY + currentCellSize}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }

                    // BOTTOM-RIGHT CORNER
                    if (!hasRight) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize}
                                y1={cellY + currentCellSize - cornerLength}
                                x2={cellX + currentCellSize}
                                y2={cellY + currentCellSize}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }
                    if (!hasBottom || hasLanthanideBelow) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize - cornerLength}
                                y1={cellY + currentCellSize}
                                x2={cellX + currentCellSize}
                                y2={cellY + currentCellSize}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }

                    // CONNECTING SEGMENTS BETWEEN ADJACENT CORNER SEGMENTS

                    // Connect to right neighbor's corner segments
                    if (hasRight) {
                        const rightCellX = (col + 1) * currentCellSize

                        // Connect top horizontal segments
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize - cornerLength}
                                y1={cellY}
                                x2={rightCellX + cornerLength}
                                y2={cellY}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )

                        // Connect bottom horizontal segments (if both have bottom borders)
                        if ((!hasBottom || hasLanthanideBelow) && (!cellExists(row + 1, col + 1) || (row === 6 && lanthanideExists(col + 1)))) {
                            lines.push(
                                <Line
                                    key={`${lineKey++}`}
                                    x1={cellX + currentCellSize - cornerLength}
                                    y1={cellY + currentCellSize}
                                    x2={rightCellX + cornerLength}
                                    y2={cellY + currentCellSize}
                                    stroke={borderColor}
                                    strokeWidth={borderWidth}
                                />,
                            )
                        }
                    }

                    // Connect to bottom neighbor's corner segments
                    if (hasBottom) {
                        const bottomCellY = (row + 1) * currentCellSize

                        // Connect left vertical segments
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX}
                                y1={cellY + currentCellSize - cornerLength}
                                x2={cellX}
                                y2={bottomCellY + cornerLength}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )

                        // Connect right vertical segments (if both have right borders)
                        if (!hasRight && !cellExists(row + 1, col + 1)) {
                            lines.push(
                                <Line
                                    key={`${lineKey++}`}
                                    x1={cellX + currentCellSize}
                                    y1={cellY + currentCellSize - cornerLength}
                                    x2={cellX + currentCellSize}
                                    y2={bottomCellY + cornerLength}
                                    stroke={borderColor}
                                    strokeWidth={borderWidth}
                                />,
                            )
                        }
                    }

                    // Connect to lanthanide below (special case for row 6)
                    if (hasLanthanideBelow) {
                        const lanthanideCellY = ROWS_MAIN * currentCellSize

                        // Connect left vertical segments
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX}
                                y1={cellY + currentCellSize - cornerLength}
                                x2={cellX}
                                y2={lanthanideCellY + cornerLength}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )

                        // Connect right vertical segments if no right neighbor
                        if (!hasRight) {
                            lines.push(
                                <Line
                                    key={`${lineKey++}`}
                                    x1={cellX + currentCellSize}
                                    y1={cellY + currentCellSize - cornerLength}
                                    x2={cellX + currentCellSize}
                                    y2={lanthanideCellY + cornerLength}
                                    stroke={borderColor}
                                    strokeWidth={borderWidth}
                                />,
                            )
                        }
                    }
                }
            }
        }

        // Lanthanides - directly connected to main table (no gap)
        const lanthanideStartY = ROWS_MAIN * currentCellSize
        for (let col = 0; col < COLUMNS; col++) {
            if (lanthanideExists(col)) {
                const cellX = col * currentCellSize
                const cellY = lanthanideStartY

                // Check for neighbors within lanthanides row
                const hasLeft = lanthanideExists(col - 1)
                const hasRight = lanthanideExists(col + 1)
                const hasMainTableAbove = cellExists(6, col)
                const hasActinideBelow = actinideExists(col)

                // TOP-LEFT CORNER - only draw if no main table element above
                if (!hasMainTableAbove) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX}
                            y1={cellY}
                            x2={cellX + cornerLength}
                            y2={cellY}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX}
                        y1={cellY}
                        x2={cellX}
                        y2={cellY + cornerLength}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )

                // TOP-RIGHT CORNER
                if (!hasMainTableAbove) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize - cornerLength}
                            y1={cellY}
                            x2={cellX + currentCellSize}
                            y2={cellY}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
                const isLu = lanthanideGrid[col]?.atomicNumber === 71
                if (!hasRight || isLu) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize}
                            y1={cellY}
                            x2={cellX + currentCellSize}
                            y2={cellY + cornerLength}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }

                // BOTTOM-LEFT CORNER
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX}
                        y1={cellY + currentCellSize - cornerLength}
                        x2={cellX}
                        y2={cellY + currentCellSize}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX}
                        y1={cellY + currentCellSize}
                        x2={cellX + cornerLength}
                        y2={cellY + currentCellSize}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )

                // BOTTOM-RIGHT CORNER
                const isLu2 = lanthanideGrid[col]?.atomicNumber === 71
                if (!hasRight || isLu2) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize}
                            y1={cellY + currentCellSize - cornerLength}
                            x2={cellX + currentCellSize}
                            y2={cellY + currentCellSize}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX + currentCellSize - cornerLength}
                        y1={cellY + currentCellSize}
                        x2={cellX + currentCellSize}
                        y2={cellY + currentCellSize}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )

                // Connect to right lanthanide neighbor's corner segments
                if (hasRight) {
                    const rightCellX = (col + 1) * currentCellSize

                    // Connect top horizontal segments (only if no main table above both)
                    if (!hasMainTableAbove && !cellExists(6, col + 1)) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize - cornerLength}
                                y1={cellY}
                                x2={rightCellX + cornerLength}
                                y2={cellY}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }

                    // Connect bottom horizontal segments
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize - cornerLength}
                            y1={cellY + currentCellSize}
                            x2={rightCellX + cornerLength}
                            y2={cellY + currentCellSize}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }

                // Connect to actinide below
                if (hasActinideBelow) {
                    const actinideCellY = lanthanideStartY + currentCellSize

                    // Connect left vertical segments
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX}
                            y1={cellY + currentCellSize - cornerLength}
                            x2={cellX}
                            y2={actinideCellY + cornerLength}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )

                    // Connect right vertical segments if no right neighbor
                    if (!hasRight || isLu) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize}
                                y1={cellY + currentCellSize - cornerLength}
                                x2={cellX + currentCellSize}
                                y2={actinideCellY + cornerLength}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }
                }
            }
        }

        // Actinides - directly connected to lanthanides (no gap)
        const actinideStartY = lanthanideStartY + currentCellSize
        for (let col = 0; col < COLUMNS; col++) {
            if (actinideExists(col)) {
                const cellX = col * currentCellSize
                const cellY = actinideStartY

                // Check for neighbors within actinides row
                const hasLeft = actinideExists(col - 1)
                const hasRight = actinideExists(col + 1)
                const hasLanthanideAbove = lanthanideExists(col)

                // TOP-LEFT CORNER - only draw if no lanthanide above
                if (!hasLanthanideAbove) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX}
                            y1={cellY}
                            x2={cellX + cornerLength}
                            y2={cellY}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX}
                        y1={cellY}
                        x2={cellX}
                        y2={cellY + cornerLength}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )

                // TOP-RIGHT CORNER
                if (!hasLanthanideAbove) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize - cornerLength}
                            y1={cellY}
                            x2={cellX + currentCellSize}
                            y2={cellY}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
                const isLr = actinideGrid[col]?.atomicNumber === 103
                if (!hasRight || isLr) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize}
                            y1={cellY}
                            x2={cellX + currentCellSize}
                            y2={cellY + cornerLength}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }

                // BOTTOM-LEFT CORNER
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX}
                        y1={cellY + currentCellSize - cornerLength}
                        x2={cellX}
                        y2={cellY + currentCellSize}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX}
                        y1={cellY + currentCellSize}
                        x2={cellX + cornerLength}
                        y2={cellY + currentCellSize}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )

                // BOTTOM-RIGHT CORNER
                const isLr2 = actinideGrid[col]?.atomicNumber === 103
                if (!hasRight || isLr2) {
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize}
                            y1={cellY + currentCellSize - cornerLength}
                            x2={cellX + currentCellSize}
                            y2={cellY + currentCellSize}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
                lines.push(
                    <Line
                        key={`${lineKey++}`}
                        x1={cellX + currentCellSize - cornerLength}
                        y1={cellY + currentCellSize}
                        x2={cellX + currentCellSize}
                        y2={cellY + currentCellSize}
                        stroke={borderColor}
                        strokeWidth={borderWidth}
                    />,
                )

                // Connect to right actinide neighbor's corner segments
                if (hasRight) {
                    const rightCellX = (col + 1) * currentCellSize

                    // Connect top horizontal segments (only if no lanthanide above both)
                    if (!hasLanthanideAbove && !lanthanideExists(col + 1)) {
                        lines.push(
                            <Line
                                key={`${lineKey++}`}
                                x1={cellX + currentCellSize - cornerLength}
                                y1={cellY}
                                x2={rightCellX + cornerLength}
                                y2={cellY}
                                stroke={borderColor}
                                strokeWidth={borderWidth}
                            />,
                        )
                    }

                    // Connect bottom horizontal segments
                    lines.push(
                        <Line
                            key={`${lineKey++}`}
                            x1={cellX + currentCellSize - cornerLength}
                            y1={cellY + currentCellSize}
                            x2={rightCellX + cornerLength}
                            y2={cellY + currentCellSize}
                            stroke={borderColor}
                            strokeWidth={borderWidth}
                        />,
                    )
                }
            }
        }

        return lines
    }

    const renderRow = (row: ((typeof allElements)[number] | null)[], key: string) => (
        <View key={key} style={styles.row}>
            {row.map((element, idx) => (
                <ElementCell
                    key={`${key}-${idx}`}
                    element={element}
                    isTarget={!!element && gameState.targetElements.some((t) => t.atomicNumber === element.atomicNumber)}
                    isCorrect={!!element && gameState.correctPlacements.includes(element.atomicNumber)}
                    isHighlighted={
                        !!element &&
                        gameState.currentHighlightedPosition &&
                        element.row === gameState.currentHighlightedPosition.row &&
                        element.col === gameState.currentHighlightedPosition.col
                    }
                    gamePhase={gameState.phase}
                    onPress={() => { }}
                    cellSize={currentCellSize}
                />
            ))}
        </View>
    )

    const renderSpecialRow = (elementGrid: ((typeof allElements)[number] | null)[], key: string) => (
        <View key={key} style={styles.row}>
            {elementGrid.map((element, idx) => (
                <ElementCell
                    key={`${key}-${idx}`}
                    element={element}
                    isTarget={!!element && gameState.targetElements.some((t) => t.atomicNumber === element.atomicNumber)}
                    isCorrect={!!element && gameState.correctPlacements.includes(element.atomicNumber)}
                    isHighlighted={
                        !!element &&
                        gameState.currentHighlightedPosition &&
                        element.row === gameState.currentHighlightedPosition.row &&
                        element.col === gameState.currentHighlightedPosition.col
                    }
                    gamePhase={gameState.phase}
                    onPress={() => { }}
                    cellSize={currentCellSize}
                />
            ))}
        </View>
    )

    // Updated table dimensions - no margins
    const tableWidth = COLUMNS * currentCellSize
    const tableHeight = (ROWS_MAIN + LANTHANIDE_ACTINIDE_ROWS) * currentCellSize

    return (
        <View style={styles.wrapper}>
            <View style={styles.tableContainer}>
                {/* SVG overlay for shared corner borders */}
                <Svg width={tableWidth} height={tableHeight} style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    {renderSharedCornerBorders()}
                </Svg>

                {/* Main periodic table */}
                {grid.map((row, idx) => renderRow(row, `main-${idx}`))}

                {/* Lanthanides and Actinides - now directly connected (no spacer) */}
                {renderSpecialRow(lanthanideGrid, "lanthanides")}
                {renderSpecialRow(actinideGrid, "actinides")}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 10,
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
