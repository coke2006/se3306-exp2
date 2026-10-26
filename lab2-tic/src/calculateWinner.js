// 胜负判定：把 8 条连线逐一比对
// 返回 { winner: "X" | "O" | null, line: [a, b, c] | null }
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
  [0, 4, 8], [2, 4, 6],            // 斜
];

export function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// 平局 = 没有胜者且九个格子都下满了
export function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares).winner;
}
