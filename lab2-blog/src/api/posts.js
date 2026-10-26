import { http } from "./client";

// 标准 REST 接口定义：换后台只改 client.js 里的 BASE_URL，这里一行都不用动
export const listPosts = (category) =>
  http.get("/posts" + (category && category !== "全部" ? "?category=" + category : ""));

export const getPost = (id) => http.get("/posts/" + id);

export const createPost = (post) => http.post("/posts", post);

export const updatePost = (id, post) => http.put("/posts/" + id, post);

export const deletePost = (id) => http.del("/posts/" + id);
