import { useEffect, useState } from "react";

// 第12步的产物：把“读一次 localStorage、变一次写一次”封成 Hook
// 用法和 useState 完全一样，只是刷新页面值还在
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    // 惰性初始化：只有首次渲染才读，避免每次渲染都碰 localStorage
    return saved === null ? initial : JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
