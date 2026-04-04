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
  // Remove active from every window
  WINDOWS.forEach((n) => {
    const w = getWin(n);
    if (w) w.classList.remove("active");
  });
  // Focus the target
  const win = getWin(name);
  if (!win) return;
  win.classList.add("active");
  // Raise z-index (inline overrides CSS class z-index)
  zCounter += 10;
  win.style.zIndex = zCounter;
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
    if (win && win.classList.contains("open")) {
      win.style.top = 50 + i * 30 + "px";
      win.style.left = 60 + i * 40 + "px";
      i++;
    }
  });
}

/* ============================================================
   3. WINDOW CONTROLS (title-bar buttons)
   ============================================================ */

function handleWinBtn(btn) {
  const win = btn.closest(".mac-window");
  if (!win) return;
  const name = win.id.replace("window-", "");
  const action = btn.dataset.action;

  if (action === "close") {
    closeWindow(name);
  } else if (action === "collapse") {
    // CSS hides .window-content/.window-status-bar/.window-resize on .minimised
    win.classList.toggle("minimised");
  } else if (action === "zoom") {
    if (win.classList.contains("zoomed")) {
      // Restore saved geometry
      win.style.top = win.dataset.savedTop || "";
      win.style.left = win.dataset.savedLeft || "";
      win.style.width = win.dataset.savedWidth || "";
      win.style.height = win.dataset.savedHeight || "";
      win.classList.remove("zoomed");
    } else {
      // Save current geometry
      win.dataset.savedTop = win.style.top;
      win.dataset.savedLeft = win.style.left;
      win.dataset.savedWidth = win.style.width;
      win.dataset.savedHeight = win.style.height;
      // Maximize
      win.style.top = "30px";
      win.style.left = "10px";
      win.style.width = "calc(100vw - 20px)";
      win.style.height = "calc(100vh - 52px)";
      win.classList.add("zoomed");
    }
  }
}

/* ============================================================
   4. WINDOW DRAGGING (desktop only — width > 768)
   ============================================================ */

let dragState = null;

function onDragStart(e) {
  if (window.innerWidth <= 768) return;
  // Ignore clicks on the control buttons
  if (e.target.closest(".win-btn")) return;

  const titleBar = e.currentTarget;
  const win = titleBar.closest(".mac-window");
  if (!win) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const rect = win.getBoundingClientRect();

  dragState = {
    win,
    offsetX: clientX - rect.left,
    offsetY: clientY - rect.top,
  };

  focusWindow(win.id.replace("window-", ""));
  document.body.classList.add("dragging-window");
  win.classList.add("dragging");
  e.preventDefault();
}

function onDragMove(e) {
  if (!dragState) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const w = dragState.win;
  let newTop = clientY - dragState.offsetY;
  let newLeft = clientX - dragState.offsetX;

  // Can't drag above the menu bar
  newTop = Math.max(MENUBAR_HEIGHT, newTop);
  // Keep at least 50px of the window edge on-screen
  newLeft = Math.max(-(w.offsetWidth - 50), newLeft);
  newLeft = Math.min(window.innerWidth - 50, newLeft);
  newTop = Math.min(window.innerHeight - 30, newTop);

  w.style.top = newTop + "px";
  w.style.left = newLeft + "px";
}

function onDragEnd() {
  if (!dragState) return;
  dragState.win.classList.remove("dragging");
  dragState = null;
  document.body.classList.remove("dragging-window");
}

/* ============================================================
   5. WINDOW RESIZING (desktop only)
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

    // Single click → select
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      // Suppress single-click action when it's actually the first of a dblclick
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        icons.forEach((i) => i.classList.remove("selected"));
        icon.classList.add("selected");
      }, 200);
    });

    // Double click → open window
    icon.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      clearTimeout(clickTimer);
      icon.classList.remove("selected");
      openWindow(icon.dataset.window);
    });

    // Keyboard: Enter or Space → open window
    icon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openWindow(icon.dataset.window);
      }
    });
  });

  // Click on bare desktop → deselect all icons
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
   8. MENU BAR DROPDOWNS
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
  }
}

function initMenuBar() {
  // ── Apple menu ──────────────────────────────────────────
  const appleTrigger = document.getElementById("apple-menu-trigger");
  const appleDropdown = document.getElementById("apple-dropdown");

  if (appleTrigger && appleDropdown) {
    appleTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = appleDropdown.classList.contains("open");
      isOpen ? closeAllDropdowns() : openDropdown(appleDropdown, appleTrigger);
    });

    // Apple-menu items (matched by text — no data-action on these)
    appleDropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      if (item.id === "menu-github") return; // handled separately
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

  // ── Named menu items (File / View / Windows …) ──────────
  document.querySelectorAll(".menu-item[data-menu]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById(item.dataset.menu + "-dropdown");
      if (!dropdown) return;
      const isOpen = dropdown.classList.contains("open");
      isOpen ? closeAllDropdowns() : openDropdown(dropdown, item);
    });
  });

  // ── Dropdown items with data-action ─────────────────────
  document.querySelectorAll(".dropdown-item[data-action]").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDropdownAction(item.dataset.action);
    });
  });

  // ── GitHub link ─────────────────────────────────────────
  const githubItem = document.getElementById("menu-github");
  if (githubItem) {
    githubItem.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      window.open("https://github.com/", "_blank", "noopener,noreferrer");
    });
  }

  // ── Click outside → close all ───────────────────────────
  document.addEventListener("click", closeAllDropdowns);
}

/* ============================================================
   9. POETRY WINDOW — LIST & VIEWER
   ============================================================ */

function showPoem(index) {
  const poem = window.POEMS[index];
  if (!poem) return;
  document.getElementById("poem-title").textContent = poem.title;
  document.getElementById("poem-meta").textContent = poem.meta;
  document.getElementById("poem-body").textContent = poem.body;
  document.getElementById("poem-display").style.display = "block";
  document.querySelector("#poetry-list").style.display = "none";
  document.querySelector('[data-back="poetry"]').style.display = "inline-flex";
  document.querySelector("#window-poetry .status-left").textContent =
    poem.title;
}

function showPoetryList() {
  document.getElementById("poem-display").style.display = "none";
  document.querySelector("#poetry-list").style.display = "block";
  document.querySelector('[data-back="poetry"]').style.display = "none";
  const n = window.POEMS ? window.POEMS.length : 0;
  document.querySelector("#window-poetry .status-left").textContent =
    n + (n === 1 ? " poem" : " poems");
}

function initPoetryWindow() {
  // List rows
  document.querySelectorAll(".list-row[data-poem]").forEach((row) => {
    const idx = parseInt(row.dataset.poem, 10);
    row.addEventListener("click", () => showPoem(idx));
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPoem(idx);
      }
    });
  });

  // Back button
  const backBtn = document.querySelector('[data-back="poetry"]');
  if (backBtn) backBtn.addEventListener("click", showPoetryList);
}

/* ============================================================
   10. WORKS WINDOW — GRID & VIEWER
   ============================================================ */

function showWork(index) {
  const work = (window.WORKS || [])[index];
  if (!work) return;
  document.getElementById("works-v-icon").textContent = work.icon;
  document.getElementById("works-v-type").textContent = work.type;
  document.getElementById("works-v-title").textContent = work.title;
  document.getElementById("works-v-year").textContent = work.year;
  document.getElementById("works-v-body").textContent = work.body;
  document.getElementById("works-display").style.display = "block";
  document.getElementById("works-list-view").style.display = "none";
  document.querySelector('[data-back="works"]').style.display = "inline-flex";
  document.querySelector("#window-works .status-left").textContent = work.title;
}

function showWorksList() {
  document.getElementById("works-display").style.display = "none";
  document.getElementById("works-list-view").style.display = "block";
  document.querySelector('[data-back="works"]').style.display = "none";
  const n = window.WORKS ? window.WORKS.length : 0;
  document.querySelector("#window-works .status-left").textContent =
    n + " items";
}

function initWorksWindow() {
  document.querySelectorAll(".works-card[data-work]").forEach((card) => {
    const idx = parseInt(card.dataset.work, 10);
    card.addEventListener("click", () => showWork(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showWork(idx);
      }
    });
  });

  const backBtn = document.querySelector('[data-back="works"]');
  if (backBtn) backBtn.addEventListener("click", showWorksList);
}

/* ============================================================
   11. MARKDOWN POEM LOADING
   ============================================================ */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseFrontmatter(text) {
  // Strip UTF-8 BOM if present
  const src = text.replace(/^\uFEFF/, "");
  const parts = src.split("---");
  // Expect: ['', ' fm content ', ' body content']
  if (parts.length < 3) {
    return { title: "Untitled", meta: "", body: src.trim() };
  }
  const fm = parts[1].trim();
  const body = parts.slice(2).join("---").trim();
  const data = {};
  fm.split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();
    if (key) data[key] = val;
  });
  return {
    title: data.title || "Untitled",
    meta: data.meta || "",
    body,
  };
}

function rebuildPoetryList(poems) {
  const list = document.getElementById("poetry-list");
  if (!list) return;

  // Preserve the header row, replace everything else
  const header = list.querySelector(".list-header");
  list.innerHTML = "";
  if (header) list.appendChild(header);

  poems.forEach((poem, i) => {
    const year = (poem.meta || "").split("·")[0].trim();
    const row = document.createElement("div");
    row.className = "list-row";
    row.dataset.poem = i;
    row.tabIndex = 0;
    row.innerHTML =
      `<span class="col-name">${escapeHtml(poem.title)}</span>` +
      `<span class="col-meta">${escapeHtml(year)}</span>`;
    row.addEventListener("click", () => showPoem(i));
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPoem(i);
      }
    });
    list.appendChild(row);
  });

  const n = poems.length;
  const status = document.querySelector("#window-poetry .status-left");
  if (status) status.textContent = n + (n === 1 ? " poem" : " poems");
}

async function loadPoemsFromMarkdown() {
  try {
    const idxResp = await fetch("poems/index.json");
    if (!idxResp.ok)
      throw new Error("poems/index.json not found (" + idxResp.status + ")");
    const files = await idxResp.json();
    if (!Array.isArray(files) || files.length === 0)
      throw new Error("Empty index");

    const poems = await Promise.all(
      files.map(async (filename) => {
        const resp = await fetch("poems/" + filename);
        if (!resp.ok) throw new Error("Could not fetch poems/" + filename);
        return parseFrontmatter(await resp.text());
      }),
    );

    window.POEMS = poems;
    rebuildPoetryList(poems);
  } catch (err) {
    // Fall back to the inline window.POEMS defined in index.html
    // (this also happens normally when previewing via file:// locally)
    console.info(
      "[poems] Using inline data — markdown load skipped:",
      err.message,
    );
  }
}

/* ============================================================
   12. WINDOW CLICK → FOCUS (mousedown on any part of window)
   ============================================================ */

function initWindowFocus() {
  WINDOWS.forEach((name) => {
    const win = getWin(name);
    if (!win) return;
    win.addEventListener("mousedown", () => focusWindow(name));
  });
}

/* ============================================================
   13. GLOBAL MOUSE & TOUCH EVENTS (drag + resize routing)
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

  // Touch move/end for title-bar drag
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
   14. ATTACH TITLE-BAR & RESIZE HANDLE LISTENERS
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

  // Delegated handler for all win-btn clicks
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".win-btn");
    if (btn) handleWinBtn(btn);
  });
}

/* ============================================================
   15. RESPONSIVE: body.mobile class for CSS hooks
   ============================================================ */

function syncMobileClass() {
  document.body.classList.toggle("mobile", window.innerWidth <= 768);
}

/* ============================================================
   STARTUP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Clock
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Default window positions (desktop only)
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

  // 3. Open poetry window immediately so there's something to see
  openWindow("poetry");

  // 4. Wire everything up
  initWindowInteractions();
  initWindowFocus();
  initGlobalEvents();
  initDesktopIcons();
  initDock();
  initMenuBar();
  initPoetryWindow();
  initWorksWindow();

  // 5. Load poems from markdown (async — rebuilds list when files arrive;
  //    falls back silently to inline window.POEMS if fetch fails)
  loadPoemsFromMarkdown();

  // 6. Responsive body class
  syncMobileClass();
  window.addEventListener("resize", syncMobileClass);
});
