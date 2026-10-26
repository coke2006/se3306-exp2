import Square from "./Square";

// 棋盘：只负责把 9 个格子画出来，并把点击事件带上 index 往上抛
// 它自己不存 state——九格的值由 Game 统一管理（状态提升）
export default function Board({ squares, xIsNext, onPlay, winLine }) {
  function handleClick(i) {
    // 已经下过、或已分胜负，就不再响应
    if (squares[i] || winLine) return;
    const next = squares.slice(); // 复制一份再改，绝不原地修改
    next[i] = xIsNext ? "X" : "O";
    onPlay(next);
  }

  return (
    <div className="board">
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          highlight={winLine ? winLine.includes(i) : false}
          onSquareClick={() => handleClick(i)}
        />
      ))}
    </div>
  );
}
