import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Square } from "./components/Square"
import { TURNS, WINNER_COMBOS } from "./constants"
import "./App.css"

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board")
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.X
  })
  const [winner, setWinner] = useState(null) // Null es que no hay ganador, false es empate

  const checkWinner = (boardToCheck) => {
    // Revisamos todas la convinaciones ganadoras para ver si x u o gano
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] && // 0 -> x u o
        boardToCheck[a] === boardToCheck[b] && // 0 y 3 -> x -> x u o
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a] // x u o
      }
    }
    return null // Si no hay ganador
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    // Reseteamos tambien el localstorage
    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  }

  const checkEndGame = (newBoard) => {
    // Revisamos si hay un empate
    // Si no hay espacios vacios en el tablero
    return newBoard.every((square) => square !== null)
  }
  const updateBoard = (index) => {
    // No actualizamos esta posicion si ya tiene algo o si hay un ganador:
    if (board[index] || winner) return
    // Actualizar el tablero:
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // Cambiar el turno:
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // Guardar aqui partida
    window.localStorage.setItem("board", JSON.stringify(newBoard))
    window.localStorage.setItem("turn", turn)
    // Revisar si hay un ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // Empate
    }
  }

  return (
    <>
      <main className="board">
        <h1>Tic tac toe 🎮</h1>
        <button onClick={resetGame}>Resetear el juego</button>
        <section className="game">
          {board.map((_, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </Square>
            );
          })}
        </section>

        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

        {winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>{winner === false ? "Empate" : "Gano " + winner}</h2>

              <header className="win">
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export default App
