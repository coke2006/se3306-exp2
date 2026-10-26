const BASE_URL = ""; // 接入自己的后台时填 "https://你的域名/api"
const USE_MOCK = BASE_URL === ""; // 空地址 = 走模拟后台

import { mockRequest } from "./mock";

export async function request(path, options = {}) {
  if (USE_MOCK) {
    const body = await mockRequest(path, options); // { code, message, data }
    if (body.code !== 0) throw new Error(body.message);
    return body.data; // 必须解出 data，否则调用方拿到的是整个信封
  }

  const res = await fetch(BASE_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const body = await res.json();
  if (body.code !== 0) throw new Error(body.message);
  return body.data;
}

export const http = {
  get: (p) => request(p),
  post: (p, d) => request(p, { method: "POST", body: JSON.stringify(d) }),
  put: (p, d) => request(p, { method: "PUT", body: JSON.stringify(d) }),
  del: (p) => request(p, { method: "DELETE" }),
};
