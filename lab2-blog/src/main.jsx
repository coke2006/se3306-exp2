import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";

// 没有这个 Provider，任何 useQuery 都会直接报 No QueryClient set
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 演示用：失败就立刻显示 error 态，不反复重试
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
