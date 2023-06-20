import { useEffect, useRef, useState } from 'react'
import Sudoku, { solveSudoku } from './sudoku'
import { TMatrix } from './types/Matrix'
import './App.css'

const initialArray = new Array(9).fill(null).map(() => new Array(9).fill(0))

function App() {
  const [numbers, setNumbers] = useState<TMatrix>(initialArray)
  const [isStarted, setStarted] = useState(false)
  const [errorsCount, setErrorsCount] = useState(0)
  const [result, setResult] = useState<TMatrix>(initialArray)
  const [emptyCells, setEmptyCells] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const startup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (emptyCells < 1 || emptyCells > 81) return
    const sudoku = new Sudoku(9, emptyCells)
    sudoku.fillValues() // створення початкових значеннь
    const sudokuMap = sudoku.mat // початкова матриця
    const result = structuredClone(sudokuMap)
    solveSudoku(result, 0, 0) // метод котрмй мутує массив та вирішує судоку
    setResult(result)
    setNumbers(sudokuMap)
    setStarted(true)
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

  const savingProgressHandler = (newGrid: TMatrix) => {
    let progress = ''
    newGrid.forEach((numbersArray) => {
      progress += ',' + numbersArray.join(',')
    })
    progress = progress.slice(1, progress.length)
    localStorage.setItem('progress', progress)
  }

  const fillCell = (rowIdx: number, colIdx: number, value: number): void => {
    if (value > 9) value = value / 10
    // перевірка на корректність відповіді
    if (value == result[rowIdx][colIdx]) {
      const newGrid = [...numbers]
      newGrid[rowIdx][colIdx] = value
      setNumbers(newGrid)
      savingProgressHandler(newGrid)
    } else {
      setErrorsCount((prev) => prev + 1)
    }
  }

  const solveHandler = () => {
    setNumbers(result)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (!isStarted) {
    return (
      <>
        <h3>Кількість пустих клітинок</h3>
        <form>
          <input
            className="cells-count-input"
            value={emptyCells}
            ref={inputRef}
            onChange={(e) => setEmptyCells(parseInt(e.target.value) || 0)}
            type="text"
          />
          <button
            type="submit"
            className="solve-btn"
            onClick={(e) => startup(e)}
          >
            Грати
          </button>
        </form>
      </>
    )
  } else {
    return (
      <>
        <h2>{errorsCount}</h2>
        <div className="wrapper">
          {numbers.map((rowItem, rowIndex) => {
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
        <button onClick={solveHandler} className="solve-btn">
          Solve
        </button>
      </>
    )
  }
}

export default App
