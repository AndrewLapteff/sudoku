import { TMatrix } from "./types/Matrix"

// Алгоритм генерації: https://www.geeksforgeeks.org/program-sudoku-generator/

export default class Sudoku {
    N: number
    K: number
    SRN: number
    mat: TMatrix
    constructor(N: number, K: number) {
        this.N = N
        this.K = K
        const SRNd = Math.sqrt(N)
        this.SRN = Math.floor(SRNd)
        this.mat = Array.from({
            length: N
        }, () => Array.from({
            length: N
        }, () => 0))
    }

    fillValues() {
        this.fillDiagonal()

        this.fillRemaining(0, this.SRN)

        this.removeKDigits()
    }

    fillDiagonal() {
        for (let i = 0; i < this.N; i += this.SRN) {
            this.fillBox(i, i)
        }
    }

    unUsedInBox(rowStart: number, colStart: number, num: number) {
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                if (this.mat[ rowStart + i ][ colStart + j ] === num) {
                    return false
                }
            }
        }
        return true
    }

    fillBox(row: number, col: number) {
        let num = 0
        const helper = true
        for (let i = 0; i < this.SRN; i++) {
            for (let j = 0; j < this.SRN; j++) {
                while (helper) {
                    num = this.randomGenerator(this.N)
                    if (this.unUsedInBox(row, col, num)) {
                        break
                    }
                }
                this.mat[ row + i ][ col + j ] = num
            }
        }
    }

    randomGenerator(num: number) {
        return Math.floor(Math.random() * num + 1)
    }

    checkIfSafe(i: number, j: number, num: number) {
        return (
            this.unUsedInRow(i, num) &&
            this.unUsedInCol(j, num) &&
            this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
        )
    }

    unUsedInRow(i: number, num: number) {
        for (let j = 0; j < this.N; j++) {
            if (this.mat[ i ][ j ] === num) {
                return false
            }
        }
        return true
    }

    unUsedInCol(j: number, num: number) {
        for (let i = 0; i < this.N; i++) {
            if (this.mat[ i ][ j ] === num) {
                return false
            }
        }
        return true
    }

    fillRemaining(i: number, j: number): boolean {
        if (i === this.N - 1 && j === this.N) {
            return true
        }

        if (j === this.N) {
            i += 1
            j = 0
        }


        if (this.mat[ i ][ j ] !== 0) {
            return this.fillRemaining(i, j + 1)
        }

        for (let num = 1; num <= this.N; num++) {
            if (this.checkIfSafe(i, j, num)) {
                this.mat[ i ][ j ] = num
                if (this.fillRemaining(i, j + 1)) {
                    return true
                }
                this.mat[ i ][ j ] = 0
            }
        }

        return false
    }

    printSudoku() {
        for (let i = 0; i < this.N; i++) {
            console.log(this.mat[ i ].join(" "))
        }
    }

    removeKDigits() {
        let count = this.K

        while (count !== 0) {
            const i = Math.floor(Math.random() * this.N)
            const j = Math.floor(Math.random() * this.N)
            if (this.mat[ i ][ j ] !== 0) {
                count--
                this.mat[ i ][ j ] = 0
            }
        }

        return
    }
}


// Алгоритм вирішення: https://www.geeksforgeeks.org/sudoku-backtracking-7/

const N = 9

export function solveSudoku(grid: TMatrix, row: number, col: number) {

    if (row == N - 1 && col == N)
        return true

    if (col == N) {
        row++
        col = 0
    }

    if (grid[ row ][ col ] != 0)
        return solveSudoku(grid, row, col + 1)

    for (let num = 1; num < 10; num++) {

        if (isSafe(grid, row, col, num)) {

            grid[ row ][ col ] = num

            if (solveSudoku(grid, row, col + 1))
                return true
        }

        grid[ row ][ col ] = 0
    }
    return false
}

export function print(grid: TMatrix) {
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++)
            document.write(grid[ i ][ j ] + " ")

        document.write("<br>")
    }
}

function isSafe(grid: TMatrix, row: number, col: number, num: number) {

    for (let x = 0; x <= 8; x++)
        if (grid[ row ][ x ] == num)
            return false

    for (let x = 0; x <= 8; x++)
        if (grid[ x ][ col ] == num)
            return false

    const startRow = row - row % 3,
        startCol = col - col % 3

    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (grid[ i + startRow ][ j + startCol ] == num)
                return false

    return true
}