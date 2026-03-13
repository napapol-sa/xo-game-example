"use client"

import { useState } from "react"

type Props = {
  onGameEnd: (result: "WIN" | "LOSS" | "DRAW") => void
}

export default function Game({ onGameEnd }: Props) {
  const playerSymbol = "X"
  const botSymbol = "O"

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [winner, setWinner] = useState<string | null>(null)

  function checkWinner(board: (string | null)[]) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ]

    for (let [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a,b,c] }
      }
    }

    return null
  }

  function botMove(boardState: (string | null)[]) {
    const empty = boardState
      .map((v, i) => (v === null ? i : null))
      .filter(v => v !== null) as number[]

    if (empty.length === 0) return boardState

    const randomIndex = empty[Math.floor(Math.random() * empty.length)]
    const newBoard = [...boardState]
    newBoard[randomIndex] = botSymbol

    return newBoard
  }

  function handleClick(i: number) {
    if (board[i] || winner || isDraw) return

    const boardAfterPlayer = [...board]
    boardAfterPlayer[i] = playerSymbol

    // 1. Check if player won
    const playerWin = checkWinner(boardAfterPlayer)
    if (playerWin) {
      setBoard(boardAfterPlayer)
      setWinner(playerWin.winner)
      setWinningLine(playerWin.line)
      onGameEnd("WIN")
      return
    }

    // 2. Check for draw after player move
    if (boardAfterPlayer.every(cell => cell !== null)) {
      setBoard(boardAfterPlayer)
      onGameEnd("DRAW")
      return
    }

    // 3. Bot move
    const boardAfterBot = botMove(boardAfterPlayer)
    const botWin = checkWinner(boardAfterBot)
    
    if (botWin) {
      setWinner(botWin.winner)
      setWinningLine(botWin.line)
      onGameEnd("LOSS")
    } else if (boardAfterBot.every(cell => cell !== null)) {
      // Draw after bot move
      onGameEnd("DRAW")
    }

    setBoard(boardAfterBot)
  }

  const isDraw = !winner && board.every(cell => cell !== null)

  function resetGame() {
    setBoard(Array(9).fill(null))
    setWinningLine(null)
    setWinner(null)
  }

  return (
    <div className="game-container">
      <div className="game-status">
        <h2>
          {winner
            ? `Winner: ${winner}`
            : isDraw
            ? "Draw!"
            : `Try your best`}
        </h2>
      </div>

      <div className="game-grid">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`game-cell ${winningLine?.includes(i) ? "winning" : ""}`}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className={`reset-button ${winner || isDraw ? "" : "hidden"}`}
      >
        Try again
      </button>
    </div>
  )
}