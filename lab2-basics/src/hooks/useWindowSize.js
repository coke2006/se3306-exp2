import { useEffect, useState } from "react";

// 训练6：自定义 Hook —— 本质就是一个“用了别的 Hook 的普通函数”
// 必须以 use 开头，ESLint 的 rules-of-hooks 才认它是 Hook，才能检查调用顺序
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    // 卸载时一定要摘掉监听，否则组件没了回调还在跑
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
