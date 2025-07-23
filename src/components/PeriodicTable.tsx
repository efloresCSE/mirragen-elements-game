"use client"

import React, { useLayoutEffect, useState } from "react"
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useGame } from "../context/GameContext"
import { PERIODIC_TABLE_DATA } from "../data/elements"
import ElementCell from "./ElementCell"

const COLUMNS = 9
const ROWS_MAIN = 7

// Calculate cell size more reliably
const getOptimalCellSize = () => {
    const { width, height } = Dimensions.get("window")
    const reservedVerticalSpace = height * 0.35 // Reserve more space for UI
    const availableHeight = height - reservedVerticalSpace
    const availableWidth = width - 40 // Account for padding

    // Calculate based on both width and height constraints
    const cellFromWidth = availableWidth / COLUMNS
    const cellFromHeight = availableHeight / (ROWS_MAIN + 2) // +2 for lanthanides/actinides

    // Use the smaller dimension but ensure minimum size
    const calculatedSize = Math.min(cellFromWidth, cellFromHeight)
    return Math.max(32, Math.min(calculatedSize, 50)) // Min 32px, max 50px
}

export const CELL_SIZE = getOptimalCellSize()

export default function PeriodicTable() {
    const { gameState, selectElement } = useGame()
    const [showRightHalf, setShowRightHalf] = useState(false)
    const [dimensions, setDimensions] = useState(Dimensions.get("window"))

    // Update dimensions when screen rotates or changes
    useLayoutEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimensions(window)
        })

        return () => subscription?.remove()
    }, [])

    // Recalculate cell size based on current dimensions
    const currentCellSize = React.useMemo(() => {
        const reservedVerticalSpace = dimensions.height * 0.35
        const availableHeight = dimensions.height - reservedVerticalSpace
        const availableWidth = dimensions.width - 40

        const cellFromWidth = availableWidth / COLUMNS
        const cellFromHeight = availableHeight / (ROWS_MAIN + 2)

        const calculatedSize = Math.min(cellFromWidth, cellFromHeight)
        return Math.max(32, Math.min(calculatedSize, 50))
    }, [dimensions])

    // Main table elements
    const mainElements = PERIODIC_TABLE_DATA.filter((el) => el.row <= 7)
    const filteredMain = mainElements
        .filter((el) => (showRightHalf ? el.col > 9 : el.col <= 9))
        .map((el) => ({ ...el, col: showRightHalf ? el.col - 9 : el.col }))

    const grid: ((typeof filteredMain)[number] | null)[][] = Array(ROWS_MAIN)
        .fill(null)
        .map(() => Array(COLUMNS).fill(null))

    filteredMain.forEach((el) => {
        if (el.row >= 1 && el.row <= ROWS_MAIN && el.col >= 1 && el.col <= COLUMNS) {
            grid[el.row - 1][el.col - 1] = el
        }
    })

    // Lanthanides & actinides
    const lanRaw = PERIODIC_TABLE_DATA.filter((el) => el.atomicNumber >= 57 && el.atomicNumber <= 71)
    const actRaw = PERIODIC_TABLE_DATA.filter((el) => el.atomicNumber >= 89 && el.atomicNumber <= 103)

    const lanShift = lanRaw.map((el, i) => ({ ...el, col: i + 3 }))
    const actShift = actRaw.map((el, i) => ({ ...el, col: i + 3 }))

    const filteredLan = lanShift
        .filter((el) => (showRightHalf ? el.col > 9 : el.col <= 9))
        .map((el) => ({ ...el, col: showRightHalf ? el.col - 9 : el.col }))

    const filteredAct = actShift
        .filter((el) => (showRightHalf ? el.col > 9 : el.col <= 9))
        .map((el) => ({ ...el, col: showRightHalf ? el.col - 9 : el.col }))

    const renderRow = (row: ((typeof filteredMain)[number] | null)[], key: string) => (
        <View key={key} style={styles.row}>
            {row.map((element, idx) => (
                <ElementCell
                    key={`${key}-${idx}`}
                    element={element}
                    isTarget={!!element && gameState.targetElements.some((t) => t.atomicNumber === element.atomicNumber)}
                    isCorrect={!!element && gameState.correctPlacements.includes(element.atomicNumber)}
                    isCurrentTarget={
                        !!element &&
                        gameState.phase === "recall" &&
                        gameState.targetElements[gameState.currentElementIndex]?.atomicNumber === element.atomicNumber
                    }
                    gamePhase={gameState.phase}
                    onPress={() => element && selectElement(element.atomicNumber)}
                    cellSize={currentCellSize}
                />
            ))}
        </View>
    )

    const renderSpecialRow = (elements: any[], key: string) => {
        const row: ((typeof elements)[number] | null)[] = Array(COLUMNS).fill(null)
        elements.forEach((el) => {
            if (el.col >= 1 && el.col <= COLUMNS) {
                row[el.col - 1] = el
            }
        })
        return renderRow(row, key)
    }

    return (
        <View style={styles.wrapper}>
            {/* Toggle Button */}
            <TouchableOpacity
                style={[styles.floatingButton, showRightHalf ? styles.leftPosition : styles.rightPosition]}
                onPress={() => setShowRightHalf(!showRightHalf)}
            >
                <Text style={styles.floatingText}>{showRightHalf ? "←" : "→"}</Text>
            </TouchableOpacity>

            {/* Scrollable Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.tableContainer}>
                    {grid.map((row, idx) => renderRow(row, `main-${idx}`))}
                    <View style={styles.spacer} />
                    {renderSpecialRow(filteredLan, "lan")}
                    {renderSpecialRow(filteredAct, "act")}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    scrollContent: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    tableContainer: {
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
    },
    spacer: {
        height: 10,
    },
    floatingButton: {
        position: "absolute",
        top: 10,
        zIndex: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2196F3",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    rightPosition: {
        right: 10,
    },
    leftPosition: {
        left: 10,
    },
    floatingText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
})
