// 用无头 Chrome + CDP 真实操作页面并截图（实验二：井字棋 / 基础训练营 / 博客）
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const PORT = 9334;
const OUT = path.resolve(__dirname, "..", "lab2-shots");
const TIC = "http://localhost:4173";
const BASICS = "http://localhost:4174";
const BLOG = "http://localhost:4175";
const W = 1360;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function jsonApi(p, method = "GET") {
  const res = await fetch(`http://127.0.0.1:${PORT}${p}`, { method });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`CDP 返回非 JSON: ${text.slice(0, 120)}`);
  }
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        const waiters = this.events.get(msg.method) || [];
        waiters.forEach((w) => w(msg.params));
        this.events.set(msg.method, []);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  once(method, timeout = 15000) {
    return new Promise((resolve) => {
      const waiters = this.events.get(method) || [];
      waiters.push(resolve);
      this.events.set(method, waiters);
      setTimeout(() => resolve(null), timeout);
    });
  }
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });
  return new Cdp(ws);
}

let cdp;

async function open(url, wait = 900) {
  if (cdp) {
    try {
      cdp.ws.close();
    } catch {}
  }
  const target = await jsonApi(`/json/new?${encodeURIComponent(url)}`, "PUT");
  cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: W,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }],
  });
  await cdp.send("Page.navigate", { url });
  await cdp.once("Page.loadEventFired", 15000);
  await sleep(wait);
}

async function evalJs(code, awaitPromise = false) {
  const r = await cdp.send("Runtime.evaluate", {
    expression: code,
    returnByValue: true,
    awaitPromise,
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description || ""));
  return r.result.value;
}

async function shot(name, maxH = 2400) {
  const h = await evalJs(`Math.min(Math.ceil(document.documentElement.scrollHeight), ${maxH})`);
  const r = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: W, height: h, scale: 1 },
  });
  fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(r.data, "base64"));
  console.log(`  ✓ ${name}.png (${W}x${h})`);
}

// 按文字点按钮 / 页签
async function clickText(selector, text) {
  const ok = await evalJs(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((n) => n.textContent.trim().includes(${JSON.stringify(text)}));
    if (!el) return false;
    el.click();
    return true;
  })()`);
  if (!ok) throw new Error(`找不到含「${text}」的 ${selector}`);
  await sleep(280);
}

// 给受控输入框赋值（React 需要原生 setter + input 事件）
async function typeInto(selector, value, index = 0) {
  await evalJs(`(() => {
    const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(120);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const userDataDir = path.join(os.tmpdir(), `cdp-profile-lab2-${Date.now()}`);

  const chrome = spawn(
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--hide-scrollbars",
      "--window-size=1360,900",
      "--proxy-server=direct://",
      "--proxy-bypass-list=*",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      await jsonApi("/json/version");
      ready = true;
      break;
    } catch {
      await sleep(500);
    }
  }
  if (!ready) {
    console.error("Chrome CDP 未就绪");
    chrome.kill();
    process.exit(1);
  }

  try {
    // ========== 任务1 井字棋 ==========
    console.log("任务1 井字棋");
    await open(`${TIC}/`);
    await shot("1.1-tic-start");

    // X:0  O:3  X:1  O:4  X:2 → 第一行连成，X 赢
    for (const i of [0, 3, 1, 4, 2]) {
      await evalJs(`document.querySelectorAll('.square')[${i}].click()`);
      await sleep(120);
    }
    await shot("1.2-tic-win");

    // 时间旅行：回到第 2 步
    await clickText(".move", "第 2 步");
    await shot("1.3-tic-timetravel");

    // ========== 任务2 六个训练 ==========
    console.log("任务2 基础训练");
    await open(`${BASICS}/`);
    await shot("2.1-train1-jsx");

    await clickText(".tab", "训练2");
    await shot("2.2-train2-es6");

    await clickText(".tab", "训练3");
    await evalJs(`document.querySelectorAll('.btn')[0].click()`);
    await sleep(150);
    await typeInto('input[placeholder="随便输点什么"]', "React 受控输入");
    await evalJs(`(() => {
      const el = document.querySelector('input[placeholder="新任务"]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'复习 useEffect');
      el.dispatchEvent(new Event('input',{bubbles:true}));
    })()`);
    await sleep(120);
    await clickText(".btn", "加一项");
    await shot("2.3-train3-usestate");

    await clickText(".tab", "训练4");
    // 两边输入不同内容
    await typeInto(".keylist input", "我输入的是A");
    await evalJs(`(() => {
      const inputs = document.querySelectorAll('.keylist input');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
      ['我输入的是A','我输入的是B','我输入的是C','我输入的是A','我输入的是B','我输入的是C'].forEach((v,i)=>{
        setter.call(inputs[i], v);
        inputs[i].dispatchEvent(new Event('input',{bubbles:true}));
      });
    })()`);
    await sleep(200);
    await shot("2.4-train4-before");
    // 两个列表各删第一项
    await evalJs(`(() => {
      const btns = [...document.querySelectorAll('.btn')].filter(b => b.textContent.includes('删除第一项'));
      btns[0].click(); btns[1].click();
    })()`);
    await sleep(350);
    await shot("2.5-train4-keytrap");

    await clickText(".tab", "训练5");
    for (let i = 0; i < 3; i++) {
      await evalJs(`[...document.querySelectorAll('.btn')].find(b => b.textContent.trim()==='+1').click()`);
      await sleep(150);
    }
    await evalJs(`[...document.querySelectorAll('.btn')].find(b => b.textContent.includes('n +1')).click()`);
    await sleep(150);
    await evalJs(`[...document.querySelectorAll('.btn')].find(b => b.textContent.trim()==='开始').click()`);
    await sleep(1300);
    // 两个陷阱各连点 3 次
    await evalJs(`(() => {
      const b = [...document.querySelectorAll('.btn')].find(x => x.textContent.includes('连点 3 次'));
      b.click(); b.click(); b.click();
      const b2 = [...document.querySelectorAll('.btn')].find(x => x.textContent.includes('连点 3 次') && x.closest('.card-good'));
      b2.click(); b2.click(); b2.click();
    })()`);
    await sleep(700);
    await shot("2.6-train5-useeffect");

    await clickText(".tab", "训练6");
    await shot("2.7-train6-customhook");

    await clickText(".tab", "任务3");
    await typeInto(".searchbar input", "果");
    await sleep(200);
    await shot("2.8-task3-thinking");

    // ========== 任务4/5 博客 ==========
    console.log("任务4 博客");
    await open(`${BLOG}/`, 1100);
    await shot("3.1-blog-home");

    // 打开详情
    await evalJs(`document.querySelectorAll('.post-item')[0].click()`);
    await sleep(400);
    await shot("3.2-blog-detail");
    await evalJs(`document.querySelector('.close').click()`);
    await sleep(300);

    // 写文章 + 发布（表单草稿演示）
    await typeInto('input[placeholder="给文章起个标题"]', "周末去天河公园跑步");
    await typeInto('textarea', "早上六点出门，绕湖跑了五公里，回来路上买了两块钱的豆浆。");
    await typeInto('input[placeholder="一句话介绍"]', "一条生活流水账");
    await evalJs(`(() => {
      const s = document.querySelector('select');
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;
      setter.call(s, '生活');
      s.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await sleep(250);
    await shot("3.3-blog-form-filled");
    await clickText(".btn", "发布");
    await sleep(500);
    await shot("3.4-blog-published");

    // 刷新验证 persist：重载后搜索新文章标题，能搜到 = 数据在 localStorage 里活过了刷新
    await cdp.send("Page.reload");
    await cdp.once("Page.loadEventFired", 15000);
    await sleep(1200);
    const persisted = await evalJs(`document.body.innerText.includes('周末去天河公园跑步')`);
    console.log("  persist 生效:", persisted);
    await typeInto('input[placeholder="搜索标题或正文…"]', "天河公园");
    await sleep(350);
    await shot("3.5-blog-persist");
    await typeInto('input[placeholder="搜索标题或正文…"]', " ");

    // 分类过滤 + 搜索
    await clickText(".chip", "技术");
    await sleep(250);
    await shot("3.6-blog-filter");

    await evalJs(`document.querySelectorAll('.chip')[0].click()`);
    await sleep(200);
    await typeInto('input[placeholder="搜索标题或正文…"]', "不存在的关键词");
    await sleep(300);
    await shot("3.7-blog-empty");

    // 服务端文章：先开 1.5s 网络延迟再进页面，列表请求还没回来 → pending 骨架屏
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false, latency: 1500, downloadThroughput: -1, uploadThroughput: -1,
    });
    await open(`${BLOG}/`, 2600);
    await clickText(".nav-btn", "服务端文章");
    await sleep(600);
    // 构建版默认数据源是内置 mock（本地 Promise，不受节流影响），切到 json-server 走真实网络
    await evalJs(`(() => {
      const s = document.querySelector('select');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'json');
      s.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await sleep(450);
    await shot("3.8-remote-pending", 1200);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1,
    });
    await sleep(2600);
    await shot("3.9-remote-success");

    // error：故障演练
    await evalJs(`(() => {
      const s = document.querySelector('select');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'broken');
      s.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await sleep(1600);
    await shot("3.10-remote-error");

    // 乐观更新：切回 json-server，发布一条，立刻截图看临时数据
    await evalJs(`(() => {
      const s = document.querySelector('select');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'json');
      s.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await sleep(1400);
    await typeInto("form input.input", "乐观更新测试：这条先秒出");
    await evalJs(`[...document.querySelectorAll('.btn')].find(b => b.textContent.trim()==='发布').click()`);
    await sleep(160);
    await shot("3.11-remote-optimistic", 1200);
    await sleep(1400);
    await shot("3.12-remote-settled", 1200);

    // 回滚：故障源 + 发布
    await evalJs(`(() => {
      const s = document.querySelector('select');
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'broken');
      s.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await sleep(1500);
    await typeInto("form input.input", "这条注定失败，验证回滚");
    await evalJs(`[...document.querySelectorAll('.btn')].find(b => b.textContent.trim()==='发布').click()`);
    await sleep(1300);
    await shot("3.13-remote-rollback", 1400);

    await clickText(".nav-btn", "关于本项目");
    await sleep(300);
    await shot("3.14-blog-about");

    // ========== 组件树图 ==========
    console.log("组件树图");
    const treeUrl = `file:///${path.join(__dirname, "tree.html").replace(/\\/g, "/")}`;
    await open(treeUrl, 500);
    await shot("4.1-tree");
  } catch (e) {
    console.error("截图过程出错:", e.message);
  } finally {
    try {
      chrome.kill();
    } catch {}
  }

  const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".png"));
  console.log(`\n共生成 ${files.length} 张截图 → ${OUT}`);
})();
