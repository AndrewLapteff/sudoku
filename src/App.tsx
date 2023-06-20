import { useEffect, useState } from 'react'
import Sudoku, { solveSudoku } from './Sudoku'
import { TMatrix } from './types/Matrix'
import './App.css'

const initialArray = new Array(9).fill(null).map(() => new Array(9).fill(0))

function App() {
  const [numbers, setNumbers] = useState<TMatrix>(initialArray)
  const [errorsCount, setErrorsCount] = useState(0)
  const [result, setResult] = useState<TMatrix>(initialArray)

  useEffect(() => {
    const sudoku = new Sudoku(9, 40)
    sudoku.fillValues() // створення початкових значеннь
    const sudokuMap = sudoku.mat // початкова матриця
    const result = structuredClone(sudokuMap)
    solveSudoku(result, 0, 0) // метод котрмй мутує массив та вирішує судоку
    setResult(result)
    setNumbers(sudokuMap)
  }, [])

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
    if (value > 9) {
      value = value / 10
    }
    // перевірка на корректність відповіді
    if (value == result[rowIdx][colIdx]) {
      const newGrid = [...numbers]
      newGrid[rowIdx][colIdx] = value
      setNumbers(newGrid)
    } else {
      setErrorsCount((prev) => prev + 1)
    }
  }

  const solveHandler = () => {
    setNumbers(result)
  }

  // перевірка на заповнення матриці
  if (numbers[0].length != 0)
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

export default App
