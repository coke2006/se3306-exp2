import { useState } from "react";
import Board from "./Board";
import { calculateWinner, isDraw } from "./calculateWinner";

// 游戏顶层：三个状态全在这里
//   history      每走一步就把整个棋盘快照存进数组（不可变更新）
//   currentMove  当前正在看第几步（时间旅行就是改这个数字）
//   xIsNext      由 currentMove 的奇偶算出来，不单独存（避免冗余 state）
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const squares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const { winner, line } = calculateWinner(squares);
  const draw = isDraw(squares);

  function handlePlay(nextSquares) {
    // 从中间某一步重新落子时，后面的分支作废（否则时间线会分叉）
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const status = winner
    ? `胜者：${winner}`
    : draw
      ? "平局，谁也没赢"
      : `下一步：${xIsNext ? "X" : "O"}`;

  function describe(move) {
    if (move === 0) return "游戏开始";
    const board = history[move];
    // 找出这一步新落下的格子
    const idx = board.findIndex((v, i) => v !== history[move - 1][i]);
    const who = move % 2 === 1 ? "X" : "O";
    return `${who} 落在第 ${Math.floor(idx / 3) + 1} 行第 ${(idx % 3) + 1} 列`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          xIsNext={xIsNext}
          onPlay={handlePlay}
          winLine={line}
        />
      </div>

      <div className="game-info">
        <div className={"status" + (winner ? " status-win" : "")}>{status}</div>
        <div className="hint">
          当前查看第 {currentMove} 步 · 已走 {history.length - 1} 步
        </div>

        <ol className="move-list">
          {history.map((_, move) => (
            <li key={move}>
              <button
                type="button"
                className={move === currentMove ? "move move-current" : "move"}
                onClick={() => jumpTo(move)}
              >
                {move === 0 ? "回到开局" : `第 ${move} 步`}
                <span className="move-desc">{describe(move)}</span>
              </button>
            </li>
          ))}
        </ol>

        <button type="button" className="reset" onClick={reset}>
          重新开始
        </button>
      </div>
    </div>
  );
}
