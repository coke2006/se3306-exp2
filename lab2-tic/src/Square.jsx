// 单个格子：只接收三个 props —— 没有自己的 state
// 值(value)、点击回调(onSquareClick)、是否属于获胜连线(highlight)
export default function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      type="button"
      className={"square" + (highlight ? " square-win" : "")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
