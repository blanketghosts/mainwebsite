/* ============================================================
   app.js — Classic Mac OS Portfolio
   Vanilla JS · No dependencies · 'use strict'
   ============================================================ */
"use strict";

/* ============================================================
   CONSTANTS
   ============================================================ */

const WINDOWS = ["poetry", "music", "works", "about"];
const MENUBAR_HEIGHT = 22;

/* ============================================================
   1. LIVE CLOCK
   ============================================================ */

function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;

  el.textContent = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* ============================================================
   2. WINDOW MANAGEMENT
   ============================================================ */

let zCounter = 100;

function getWin(name) {
  return document.getElementById("window-" + name);
}

function openWindow(name) {
  const win = getWin(name);
  if (!win) return;

  win.classList.add("open");
  focusWindow(name);

  if (window.innerWidth <= 768) {
    win.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function closeWindow(name) {
  const win = getWin(name);
  if (!win) return;

  win.classList.remove("open", "active");
}

function focusWindow(name) {
  WINDOWS.forEach((n) => {
    const w = getWin(n);
    if (w) w.classList.remove("active");
  });

  const win = getWin(name);
  if (!win) return;

  win.classList.add("active");
  zCounter += 10;
  win.style.zIndex = String(zCounter);
}

function toggleWindow(name) {
  const win = getWin(name);
  if (!win) return;

  if (win.classList.contains("open")) {
    focusWindow(name);
  } else {
    openWindow(name);
  }
}

function closeAllWindows() {
  WINDOWS.forEach(closeWindow);
}

function arrangeWindows() {
  let i = 0;

  WINDOWS.forEach((name) => {
    const win = getWin(name);
    if (!win || !win.classList.contains("open")) return;

    win.style.top = 50 + i * 30 + "px";
    win.style.left = 60 + i * 40 + "px";
    i += 1;
  });
}

/* ============================================================
   3. WINDOW CONTROL BUTTONS
   ============================================================ */

function handleWinBtn(btn) {
  const win = btn.closest(".mac-window");
  if (!win) return;

  const name = win.id.replace("window-", "");
  const action = btn.dataset.action;

  if (action === "close") {
    closeWindow(name);
    return;
  }

  if (action === "collapse") {
    win.classList.toggle("minimised");
    return;
  }

  if (action === "zoom") {
    if (win.classList.contains("zoomed")) {
      win.style.top = win.dataset.savedTop || "";
      win.style.left = win.dataset.savedLeft || "";
      win.style.width = win.dataset.savedWidth || "";
      win.style.height = win.dataset.savedHeight || "";
      win.classList.remove("zoomed");
      return;
    }

    win.dataset.savedTop = win.style.top;
    win.dataset.savedLeft = win.style.left;
    win.dataset.savedWidth = win.style.width;
    win.dataset.savedHeight = win.style.height;

    win.style.top = "30px";
    win.style.left = "10px";
    win.style.width = "calc(100vw - 20px)";
    win.style.height = "calc(100vh - 52px)";
    win.classList.add("zoomed");
  }
}

/* ============================================================
   4. DRAGGING
   ============================================================ */

let dragState = null;

function getPointerClientPos(e) {
  if (e.touches && e.touches[0]) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  return {
    x: e.clientX,
    y: e.clientY,
  };
}

function onDragStart(e) {
  if (window.innerWidth <= 768) return;
  if (e.target.closest(".win-btn")) return;

  const titleBar = e.currentTarget;
  const win = titleBar.closest(".mac-window");
  if (!win) return;

  const pointer = getPointerClientPos(e);
  const rect = win.getBoundingClientRect();

  dragState = {
    win,
    offsetX: pointer.x - rect.left,
    offsetY: pointer.y - rect.top,
  };

  focusWindow(win.id.replace("window-", ""));
  document.body.classList.add("dragging-window");
  win.classList.add("dragging");
  e.preventDefault();
}

function onDragMove(e) {
  if (!dragState) return;

  const pointer = getPointerClientPos(e);
  const w = dragState.win;

  let newTop = pointer.y - dragState.offsetY;
  let newLeft = pointer.x - dragState.offsetX;

  newTop = Math.max(MENUBAR_HEIGHT, newTop);
  newLeft = Math.max(-(w.offsetWidth - 50), newLeft);
  newLeft = Math.min(window.innerWidth - 50, newLeft);
  newTop = Math.min(window.innerHeight - 30, newTop);

  w.style.top = newTop + "px";
  w.style.left = newLeft + "px";
}

function onDragEnd() {
  if (!dragState) return;

  dragState.win.classList.remove("dragging");
  document.body.classList.remove("dragging-window");
  dragState = null;
}

/* ============================================================
   5. RESIZING
   ============================================================ */

let resizeState = null;

function onResizeStart(e) {
  if (window.innerWidth <= 768) return;

  const win = e.currentTarget.closest(".mac-window");
  if (!win) return;

  resizeState = {
    win,
    startX: e.clientX,
    startY: e.clientY,
    startW: win.offsetWidth,
    startH: win.offsetHeight,
  };

  document.body.classList.add("resizing-window");
  e.preventDefault();
}

function onResizeMove(e) {
  if (!resizeState) return;

  const { win, startX, startY, startW, startH } = resizeState;
  const newW = Math.max(280, startW + (e.clientX - startX));
  const newH = Math.max(180, startH + (e.clientY - startY));

  win.style.width = newW + "px";
  win.style.height = newH + "px";
}

function onResizeEnd() {
  if (!resizeState) return;

  resizeState = null;
  document.body.classList.remove("resizing-window");
}

/* ============================================================
   6. DESKTOP ICONS
   ============================================================ */

function initDesktopIcons() {
  const desktop = document.getElementById("desktop");
  const icons = document.querySelectorAll(".desktop-icon");

  icons.forEach((icon) => {
    let clickTimer = null;

    icon.addEventListener("click", (e) => {
      e.stopPropagation();

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        icons.forEach((i) => i.classList.remove("selected"));
        icon.classList.add("selected");
      }, 200);
    });

    icon.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      clearTimeout(clickTimer);
      icon.classList.remove("selected");
      openWindow(icon.dataset.window);
    });

    icon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openWindow(icon.dataset.window);
      }
    });
  });

  if (desktop) {
    desktop.addEventListener("click", () => {
      icons.forEach((i) => i.classList.remove("selected"));
    });
  }
}

/* ============================================================
   7. MOBILE DOCK
   ============================================================ */

function initDock() {
  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => toggleWindow(item.dataset.window));
  });
}

/* ============================================================
   8. MENUS
   ============================================================ */

function closeAllDropdowns() {
  document
    .querySelectorAll(".menu-dropdown")
    .forEach((d) => d.classList.remove("open"));

  document
    .querySelectorAll(".menu-item, .menu-logo")
    .forEach((m) => m.classList.remove("active"));
}

function openDropdown(dropdownEl, triggerEl) {
  closeAllDropdowns();
  dropdownEl.classList.add("open");
  if (triggerEl) triggerEl.classList.add("active");
}

function handleDropdownAction(action) {
  closeAllDropdowns();

  switch (action) {
    case "open-poetry":
      openWindow("poetry");
      break;
    case "open-music":
      openWindow("music");
      break;
    case "open-works":
      openWindow("works");
      break;
    case "open-about":
      openWindow("about");
      break;
    case "arrange-windows":
      arrangeWindows();
      break;
    case "close-all":
      closeAllWindows();
      break;
    default:
      break;
  }
}

function initMenuBar() {
  const appleTrigger = document.getElementById("apple-menu-trigger");
  const appleDropdown = document.getElementById("apple-dropdown");

  if (appleTrigger && appleDropdown) {
    appleTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = appleDropdown.classList.contains("open");
      isOpen ? closeAllDropdowns() : openDropdown(appleDropdown, appleTrigger);
    });

    appleDropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      if (item.id === "menu-github") return;

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllDropdowns();

        const text = item.textContent.trim();
        if (text === "About This Site") openWindow("about");
        else if (text === "Poetry") openWindow("poetry");
        else if (text === "Music") openWindow("music");
        else if (text === "Other Works") openWindow("works");
      });
    });
  }

  document.querySelectorAll(".menu-item[data-menu]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById(item.dataset.menu + "-dropdown");
      if (!dropdown) return;

      const isOpen = dropdown.classList.contains("open");
      isOpen ? closeAllDropdowns() : openDropdown(dropdown, item);
    });
  });

  document.querySelectorAll(".dropdown-item[data-action]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDropdownAction(item.dataset.action);
    });
  });

  const githubItem = document.getElementById("menu-github");
  if (githubItem) {
    githubItem.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      window.open("https://github.com/", "_blank", "noopener,noreferrer");
    });
  }

  document.addEventListener("click", closeAllDropdowns);
}

/* ============================================================
   9. HELPERS — FRONTMATTER / MARKDOWN / ESCAPING
   ============================================================ */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseFrontmatter(text) {
  const src = String(text).replace(/^\uFEFF/, "");

  if (!src.startsWith("---")) {
    return { body: src.trim() };
  }

  const endIndex = src.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { body: src.trim() };
  }

  const fm = src.slice(3, endIndex).trim();
  const body = src.slice(endIndex + 4).trim();

  const data = {};
  fm.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;

    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) data[key] = value;
  });

  data.body = body;
  return data;
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);

  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  return html;
}

function renderMarkdown(text) {
  const source = String(text || "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!source) return "";

  const blocks = source.split(/\n{2,}/);
  const rendered = [];
  let inList = false;

  function closeList() {
    if (inList) {
      rendered.push("</ul>");
      inList = false;
    }
  }

  blocks.forEach((block) => {
    const trimmed = block.trim();

    if (!trimmed) return;

    if (
      /^[-*]\s+/m.test(trimmed) &&
      trimmed.split("\n").every((line) => /^[-*]\s+/.test(line.trim()))
    ) {
      if (!inList) {
        rendered.push("<ul>");
        inList = true;
      }

      trimmed.split("\n").forEach((line) => {
        const itemText = line.trim().replace(/^[-*]\s+/, "");
        rendered.push("<li>" + renderInlineMarkdown(itemText) + "</li>");
      });

      return;
    }

    closeList();

    if (/^###\s+/.test(trimmed)) {
      rendered.push(
        "<h3>" + renderInlineMarkdown(trimmed.replace(/^###\s+/, "")) + "</h3>",
      );
      return;
    }

    if (/^##\s+/.test(trimmed)) {
      rendered.push(
        "<h2>" + renderInlineMarkdown(trimmed.replace(/^##\s+/, "")) + "</h2>",
      );
      return;
    }

    if (/^#\s+/.test(trimmed)) {
      rendered.push(
        "<h1>" + renderInlineMarkdown(trimmed.replace(/^#\s+/, "")) + "</h1>",
      );
      return;
    }

    if (/^>\s+/.test(trimmed)) {
      const quote = trimmed
        .split("\n")
        .map((line) => line.replace(/^>\s?/, ""))
        .join(" ");
      rendered.push(
        "<blockquote>" + renderInlineMarkdown(quote) + "</blockquote>",
      );
      return;
    }

    const paragraph = trimmed
      .split("\n")
      .map((line) => renderInlineMarkdown(line))
      .join("<br>");

    rendered.push("<p>" + paragraph + "</p>");
  });

  closeList();
  return rendered.join("");
}

function derivePoemYear(poem) {
  return String(poem.meta || "")
    .split("·")[0]
    .trim();
}

/* ============================================================
   10. POETRY WINDOW
   ============================================================ */

function bindPoetryRow(row, index) {
  row.addEventListener("click", () => showPoem(index));
  row.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showPoem(index);
    }
  });
}

function showPoem(index) {
  const poem = (window.POEMS || [])[index];
  if (!poem) return;

  document.getElementById("poem-title").textContent = poem.title || "Untitled";
  document.getElementById("poem-meta").textContent = poem.meta || "";
  document.getElementById("poem-body").textContent = poem.body || "";

  document.getElementById("poem-display").style.display = "block";
  document.getElementById("poetry-list").style.display = "none";
  document.querySelector('[data-back="poetry"]').style.display = "inline-flex";
  document.querySelector("#window-poetry .status-left").textContent =
    poem.title || "Untitled";
}

function showPoetryList() {
  document.getElementById("poem-display").style.display = "none";
  document.getElementById("poetry-list").style.display = "block";
  document.querySelector('[data-back="poetry"]').style.display = "none";

  const n = Array.isArray(window.POEMS) ? window.POEMS.length : 0;
  document.querySelector("#window-poetry .status-left").textContent =
    n + (n === 1 ? " poem" : " poems");
}

function rebuildPoetryList(poems) {
  const list = document.getElementById("poetry-list");
  if (!list) return;

  const header = list.querySelector(".list-header");
  list.innerHTML = "";
  if (header) list.appendChild(header);

  poems.forEach((poem, i) => {
    const row = document.createElement("div");
    row.className = "list-row";
    row.dataset.poem = String(i);
    row.tabIndex = 0;

    row.innerHTML =
      `<span class="col-name">${escapeHtml(poem.title || "Untitled")}</span>` +
      `<span class="col-meta">${escapeHtml(derivePoemYear(poem))}</span>`;

    bindPoetryRow(row, i);
    list.appendChild(row);
  });

  showPoetryList();
}

function initPoetryWindow() {
  document.querySelectorAll(".list-row[data-poem]").forEach((row) => {
    const idx = parseInt(row.dataset.poem, 10);
    bindPoetryRow(row, idx);
  });

  const backBtn = document.querySelector('[data-back="poetry"]');
  if (backBtn) backBtn.addEventListener("click", showPoetryList);
}

/* ============================================================
   11. OTHER WORKS WINDOW
   ============================================================ */

function bindWorkCard(card, index) {
  card.addEventListener("click", () => showWork(index));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showWork(index);
    }
  });
}

function showWork(index) {
  const work = (window.WORKS || [])[index];
  if (!work) return;

  document.getElementById("works-v-icon").textContent = work.icon || "✦";
  document.getElementById("works-v-type").textContent = work.type || "";
  document.getElementById("works-v-title").textContent =
    work.title || "Untitled";
  document.getElementById("works-v-year").textContent = work.year || "";
  document.getElementById("works-v-body").innerHTML = renderMarkdown(
    work.body || "",
  );

  document.getElementById("works-display").style.display = "block";
  document.getElementById("works-list-view").style.display = "none";
  document.querySelector('[data-back="works"]').style.display = "inline-flex";
  document.querySelector("#window-works .status-left").textContent =
    work.title || "Untitled";
}

function showWorksList() {
  document.getElementById("works-display").style.display = "none";
  document.getElementById("works-list-view").style.display = "block";
  document.querySelector('[data-back="works"]').style.display = "none";

  const n = Array.isArray(window.WORKS) ? window.WORKS.length : 0;
  document.querySelector("#window-works .status-left").textContent =
    n + (n === 1 ? " item" : " items");
}

function rebuildWorksGrid(works) {
  const grid = document.querySelector("#works-list-view .works-grid");
  if (!grid) return;

  grid.innerHTML = "";

  works.forEach((work, i) => {
    const card = document.createElement("div");
    card.className = "works-card";
    card.dataset.work = String(i);
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    card.innerHTML = [
      `<div class="works-card-icon">${escapeHtml(work.icon || "✦")}</div>`,
      `<div class="works-card-type">${escapeHtml(work.type || "Work")}</div>`,
      `<div class="works-card-title">${escapeHtml(work.title || "Untitled")}</div>`,
      `<div class="works-card-year">${escapeHtml(String(work.year || ""))}</div>`,
      `<div class="works-card-desc">${escapeHtml(work.desc || "")}</div>`,
    ].join("");

    bindWorkCard(card, i);
    grid.appendChild(card);
  });

  showWorksList();
}

function initWorksWindow() {
  document.querySelectorAll(".works-card[data-work]").forEach((card) => {
    const idx = parseInt(card.dataset.work, 10);
    bindWorkCard(card, idx);
  });

  const backBtn = document.querySelector('[data-back="works"]');
  if (backBtn) backBtn.addEventListener("click", showWorksList);
}

/* ============================================================
   12. MARKDOWN COLLECTION LOADING
   ============================================================ */

async function loadCollectionFromMarkdown(manifestPath, directory, mapper) {
  const idxResp = await fetch(manifestPath);
  if (!idxResp.ok) {
    throw new Error(manifestPath + " not found (" + idxResp.status + ")");
  }

  const files = await idxResp.json();
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Empty manifest: " + manifestPath);
  }

  const items = await Promise.all(
    files.map(async (filename) => {
      const resp = await fetch(directory + "/" + filename);
      if (!resp.ok) {
        throw new Error("Could not fetch " + directory + "/" + filename);
      }

      const parsed = parseFrontmatter(await resp.text());
      return mapper(parsed, filename);
    }),
  );

  return items;
}

async function loadPoemsFromMarkdown() {
  try {
    const poems = await loadCollectionFromMarkdown(
      "poems/index.json",
      "poems",
      (data) => ({
        title: data.title || "Untitled",
        meta: data.meta || "",
        body: data.body || "",
      }),
    );

    window.POEMS = poems;
    rebuildPoetryList(poems);
  } catch (err) {
    console.info("[poems] Using inline fallback:", err.message);
    if (Array.isArray(window.POEMS)) rebuildPoetryList(window.POEMS);
  }
}

async function loadWorksFromMarkdown() {
  try {
    const works = await loadCollectionFromMarkdown(
      "works/index.json",
      "works",
      (data) => ({
        icon: data.icon || "✦",
        type: data.type || "Work",
        title: data.title || "Untitled",
        year: data.year || "",
        desc: data.desc || "",
        body: data.body || "",
      }),
    );

    window.WORKS = works;
    rebuildWorksGrid(works);
  } catch (err) {
    console.info("[works] Using inline fallback:", err.message);
    if (Array.isArray(window.WORKS)) rebuildWorksGrid(window.WORKS);
  }
}

/* ============================================================
   13. WINDOW CLICK → FOCUS
   ============================================================ */

function initWindowFocus() {
  WINDOWS.forEach((name) => {
    const win = getWin(name);
    if (!win) return;
    win.addEventListener("mousedown", () => focusWindow(name));
  });
}

/* ============================================================
   14. GLOBAL EVENTS
   ============================================================ */

function initGlobalEvents() {
  document.addEventListener("mousemove", (e) => {
    onDragMove(e);
    onResizeMove(e);
  });

  document.addEventListener("mouseup", () => {
    onDragEnd();
    onResizeEnd();
  });

  document.addEventListener(
    "touchmove",
    (e) => {
      if (dragState) {
        e.preventDefault();
        onDragMove(e);
      }
    },
    { passive: false },
  );

  document.addEventListener("touchend", onDragEnd);
}

/* ============================================================
   15. WINDOW INTERACTIONS
   ============================================================ */

function initWindowInteractions() {
  document.querySelectorAll(".title-bar").forEach((bar) => {
    bar.addEventListener("mousedown", onDragStart);
    bar.addEventListener("touchstart", onDragStart, { passive: false });
    bar.addEventListener("contextmenu", (e) => e.preventDefault());
  });

  document.querySelectorAll(".window-resize").forEach((handle) => {
    handle.addEventListener("mousedown", onResizeStart);
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".win-btn");
    if (btn) handleWinBtn(btn);
  });
}

/* ============================================================
   16. RESPONSIVE BODY CLASS
   ============================================================ */

function syncMobileClass() {
  document.body.classList.toggle("mobile", window.innerWidth <= 768);
}

/* ============================================================
   STARTUP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);

  if (window.innerWidth > 768) {
    const positions = {
      poetry: { top: 50, left: 60 },
      music: { top: 80, left: 120 },
      works: { top: 110, left: 180 },
      about: { top: 140, left: 240 },
    };

    WINDOWS.forEach((name) => {
      const win = getWin(name);
      if (!win) return;
      win.style.top = positions[name].top + "px";
      win.style.left = positions[name].left + "px";
    });
  }

  openWindow("poetry");

  initWindowInteractions();
  initWindowFocus();
  initGlobalEvents();
  initDesktopIcons();
  initDock();
  initMenuBar();
  initPoetryWindow();
  initWorksWindow();

  loadPoemsFromMarkdown();
  loadWorksFromMarkdown();

  syncMobileClass();
  window.addEventListener("resize", syncMobileClass);
});
