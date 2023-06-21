import { useEffect, useRef, useState } from 'react'
import Sudoku, { solveSudoku } from './sudoku'
import { TMatrix } from './types/Matrix'
import './App.css'

const initialArray = new Array(9).fill(null).map(() => new Array(9).fill(0))

function App() {
  const [puzzle, setPuzzle] = useState<TMatrix>(initialArray)
  const [isStarted, setStarted] = useState(false)
  const [errorsCount, setErrorsCount] = useState(0)
  const [solvedPuzzle, setSolvedPuzzle] = useState<TMatrix>(initialArray)
  const [emptyCells, setEmptyCells] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const startup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (emptyCells < 1 || emptyCells > 81) return
    const sudoku = new Sudoku(9, emptyCells)
    sudoku.fillValues() // створення початкових значеннь
    const newPuzzle = sudoku.mat // початкова матриця
    setPuzzle(newPuzzle)
    setStarted(true)
    solve(newPuzzle)
    savingProgressHandler(newPuzzle)
  }

  const decorationCheck = (colIdx: number, rowIdx: number) => {
    colIdx++
    rowIdx++
    return (
      (colIdx == 1 ||
        colIdx == 2 ||
        colIdx == 3 ||
        colIdx == 7 ||
        colIdx == 8 ||
        colIdx == 9) &&
      (rowIdx == 1 ||
        rowIdx == 2 ||
        rowIdx == 3 ||
        rowIdx == 7 ||
        rowIdx == 8 ||
        rowIdx == 9)
    )
  }

  const fillCell = (rowIdx: number, colIdx: number, value: number): void => {
    if (value > 9) value = value / 10
    // перевірка на корректність відповіді
    if (value == solvedPuzzle[rowIdx][colIdx]) {
      const newGrid = [...puzzle]
      newGrid[rowIdx][colIdx] = value
      setPuzzle(newGrid)
      savingProgressHandler(newGrid)
    } else {
      setErrorsCount((prev) => prev + 1)
    }
  }

  const solve = (puzzle: TMatrix) => {
    const puzzleClone = structuredClone(puzzle)
    solveSudoku(puzzleClone, 0, 0) // метод котрмй мутує массив та вирішує судоку
    setSolvedPuzzle(puzzleClone)
  }

  const savingProgressHandler = (newGrid: TMatrix) => {
    let progress = ''
    newGrid.forEach((numbersArray) => {
      progress += ',' + numbersArray.join(',')
    })
    progress = progress.slice(1, progress.length)
    localStorage.setItem('progress', progress)
  }

  const solveHandler = () => {
    const puzzleClone = structuredClone(puzzle)
    solveSudoku(puzzleClone, 0, 0) // метод котрмй мутує массив та вирішує судоку
    setSolvedPuzzle(puzzleClone)
    setPuzzle(puzzleClone)
    localStorage.removeItem('progress')
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const cameBackToGame = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (localStorage.getItem('progress')) {
      const progress = localStorage.getItem('progress')
      const savedPuzzle: TMatrix = initialArray
      const puzzleOrder = progress?.split(',')
      if (puzzleOrder == undefined) return false
      let index = 0
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          savedPuzzle[row][col] = +puzzleOrder[index]
          index++
        }
      }
      setPuzzle(savedPuzzle)
      setStarted(true)
      solve(savedPuzzle)
    }
  }

  const openMenu = () => {
    setStarted(false)
    setEmptyCells(0)
    setErrorsCount(0)
  }

  if (!isStarted) {
    return (
      <>
        <h3>Count of emply cells</h3>
        <form>
          <input
            className="cells-count-input"
            value={emptyCells}
            ref={inputRef}
            onChange={(e) => setEmptyCells(parseInt(e.target.value) || 0)}
            type="text"
          />
          <button type="submit" className="btn" onClick={(e) => startup(e)}>
            New game
          </button>
          <button
            type="submit"
            className="btn"
            onClick={(e) => cameBackToGame(e)}
          >
            Restore progress
          </button>
        </form>
      </>
    )
  } else {
    return (
      <>
        <h2>{errorsCount}</h2>
        <div className="wrapper">
          {puzzle.map((rowItem, rowIndex) => {
            return (
              <div key={rowIndex}>
                {rowItem.map((colItem: number, colIndex: number) => {
                  return (
                    <div
                      style={{
                        border: decorationCheck(colIndex, rowIndex)
                          ? '1px solid #fff'
                          : '1px solid #adadad',
                      }}
                      className="cell"
                      key={colIndex}
                    >
                      <input
                        disabled={colItem === 0 ? false : true}
                        onChange={(e) =>
                          fillCell(rowIndex, colIndex, parseInt(e.target.value))
                        }
                        value={colItem}
                        type="text"
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className="actions">
          <button onClick={solveHandler} className="btn">
            Solve
          </button>
          <button onClick={openMenu} className="btn">
            Menu
          </button>
        </div>
      </>
    )
  }
}

export default App
