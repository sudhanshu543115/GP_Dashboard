let containerEl = null;
let seed = 0;
const toasts = new Map();

const palette = {
  success: { bg: "#0f2a1f", border: "#1f7a4c", color: "#b6f3d1" },
  error: { bg: "#2a1313", border: "#8b2a2a", color: "#ffc7c7" },
  info: { bg: "#121d2d", border: "#2c5ea8", color: "#c9defd" },
  loading: { bg: "#22211a", border: "#8a7a2a", color: "#f6e8b1" },
};

function ensureContainer() {
  if (typeof document === "undefined") return null;
  if (containerEl) return containerEl;
  containerEl = document.createElement("div");
  containerEl.id = "app-toast-container";
  Object.assign(containerEl.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "99999",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "360px",
    width: "calc(100vw - 40px)",
    pointerEvents: "none",
  });
  document.body.appendChild(containerEl);
  return containerEl;
}

function createNode(type, message) {
  const node = document.createElement("div");
  const theme = palette[type] || palette.info;
  node.innerText = message;
  Object.assign(node.style, {
    background: theme.bg,
    color: theme.color,
    border: `1px solid ${theme.border}`,
    borderRadius: "10px",
    padding: "10px 12px",
    fontSize: "13px",
    lineHeight: "1.4",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    pointerEvents: "auto",
    opacity: "0",
    transform: "translateY(-6px)",
    transition: "all 180ms ease",
    whiteSpace: "pre-wrap",
  });
  requestAnimationFrame(() => {
    node.style.opacity = "1";
    node.style.transform = "translateY(0)";
  });
  return node;
}

function show(type, message, opts = {}) {
  const container = ensureContainer();
  if (!container) return "";
  const id = `t_${Date.now()}_${seed++}`;
  const node = createNode(type, message);
  container.appendChild(node);
  toasts.set(id, { node, timeoutId: null, type });

  if (opts.autoClose !== false && type !== "loading") {
    const timeoutId = setTimeout(() => dismiss(id), opts.duration || 2800);
    toasts.set(id, { node, timeoutId, type });
  }
  return id;
}

function dismiss(id) {
  const item = toasts.get(id);
  if (!item) return;
  if (item.timeoutId) clearTimeout(item.timeoutId);
  item.node.style.opacity = "0";
  item.node.style.transform = "translateY(-6px)";
  setTimeout(() => {
    item.node.remove();
    toasts.delete(id);
  }, 180);
}

function update(id, { type = "info", message = "" } = {}) {
  const item = toasts.get(id);
  if (!item) return show(type, message);
  const theme = palette[type] || palette.info;
  item.node.innerText = message;
  item.node.style.background = theme.bg;
  item.node.style.color = theme.color;
  item.node.style.border = `1px solid ${theme.border}`;
  if (item.timeoutId) clearTimeout(item.timeoutId);
  const timeoutId = setTimeout(() => dismiss(id), 2600);
  toasts.set(id, { ...item, timeoutId, type });
  return id;
}

export const toast = {
  success: (message, opts) => show("success", message, opts),
  error: (message, opts) => show("error", message, opts),
  info: (message, opts) => show("info", message, opts),
  loading: (message, opts) => show("loading", message, { ...opts, autoClose: false }),
  update,
  dismiss,
};

