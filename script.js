const CONFIG = window.CONFIG || {};

const apps = [
    { id: "finder", title: "Finder", icon: "home", color: "linear-gradient(135deg,#62a8ff,#3557ff)", desktop: true },
    { id: "about", title: "About Me", icon: "profile", color: "linear-gradient(135deg,#9be7ff,#6f8dff)", desktop: true },
    { id: "projects", title: "Projects", icon: "code", color: "linear-gradient(135deg,#7ee787,#23a55a)", desktop: true },
    { id: "experience", title: "Experience", icon: "grid", color: "linear-gradient(135deg,#f7bd7f,#f97316)", desktop: true },
    { id: "tech", title: "Tech Stack", icon: "braces", color: "linear-gradient(135deg,#c084fc,#7c3aed)", desktop: true },
    { id: "certs", title: "Certifications", icon: "check", color: "linear-gradient(135deg,#ff99c8,#e11d48)" },
    { id: "terminal", title: "Terminal", icon: "terminal", color: "linear-gradient(135deg,#20242d,#030712)", desktop: true },
    { id: "contact", title: "Contact", icon: "mail", color: "linear-gradient(135deg,#f472b6,#fb7185)", desktop: true },
    { id: "articles", title: "Articles", icon: "pen", color: "linear-gradient(135deg,#facc15,#f59e0b)" },
    { id: "ai", title: "TanviAI", icon: "AI", color: "linear-gradient(135deg,#22d3ee,#2563eb)" },
    { id: "arcade", title: "Developer Arcade", icon: "game", color: "linear-gradient(135deg,#a78bfa,#ec4899)", desktop: true },
    { id: "github", title: "GitHub", icon: "github", color: "linear-gradient(135deg,#2f3544,#09090b)", desktop: true },
    { id: "linkedin", title: "LinkedIn", icon: "linkedin", color: "linear-gradient(135deg,#38bdf8,#0a66c2)", desktop: true }
];

const state = {
    z: 100,
    openWindows: new Map(),
    recentlyClosedApps: [],
    activeApp: "Tanvi OS",
    spotlightIndex: 0,
    wallpaperPoints: [],
    didScatter: false
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const appById = (id) => apps.find((app) => app.id === id);
const iconSvgs = {
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5h-5.2v-6.4H8.7V21H3.5a.5.5 0 0 1-.5-.5v-9.7Z"/></svg>`,
    code: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m8.7 16.6-5-4.6 5-4.6 1.4 1.5L6.8 12l3.3 3.1-1.4 1.5Zm6.6 0-1.4-1.5 3.3-3.1-3.3-3.1 1.4-1.5 5 4.6-5 4.6ZM11 19l-2-.5L13 5l2 .5L11 19Z"/></svg>`,
    grid: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"/></svg>`,
    braces: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 4H6.5C5.1 4 4 5.1 4 6.5v2C4 9.3 3.3 10 2.5 10H2v4h.5c.8 0 1.5.7 1.5 1.5v2C4 18.9 5.1 20 6.5 20H8v-2H6.7c-.4 0-.7-.3-.7-.7v-2.1c0-1.4-.9-2.6-2.2-3.2C5.1 11.4 6 10.2 6 8.8V6.7c0-.4.3-.7.7-.7H8V4Zm8 0h1.5C18.9 4 20 5.1 20 6.5v2c0 .8.7 1.5 1.5 1.5h.5v4h-.5c-.8 0-1.5.7-1.5 1.5v2c0 1.4-1.1 2.5-2.5 2.5H16v-2h1.3c.4 0 .7-.3.7-.7v-2.1c0-1.4.9-2.6 2.2-3.2-1.3-.6-2.2-1.8-2.2-3.2V6.7c0-.4-.3-.7-.7-.7H16V4Z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m9.2 16.6-4.1-4.1L3.7 14l5.5 5.5L21 7.7 19.5 6 9.2 16.6Z"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18v14H3V5Zm4.2 9.8 4-3.8-4-3.8-1.4 1.5 2.4 2.3-2.4 2.3 1.4 1.5ZM12 15h6v-2h-6v2Z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v12H3V6Zm9 7 7-5H5l7 5Zm0 2.4L5 10.5V16h14v-5.5l-7 4.9Z"/></svg>`,
    pen: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m4 16.8 10.8-10.8 3.2 3.2L7.2 20H4v-3.2ZM16 4.8l1.2-1.2a1.4 1.4 0 0 1 2 0l1.2 1.2a1.4 1.4 0 0 1 0 2L19.2 8 16 4.8Z"/></svg>`,
    game: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 8h10c2.2 0 4 1.8 4 4v3.2c0 1.5-1.2 2.8-2.8 2.8-.9 0-1.7-.4-2.2-1.1L14.6 15H9.4L8 16.9c-.5.7-1.3 1.1-2.2 1.1C4.2 18 3 16.7 3 15.2V12c0-2.2 1.8-4 4-4Zm.5 3v1.5H6V14h1.5v1.5H9V14h1.5v-1.5H9V11H7.5Zm8.5 1.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm2.2 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.8 2.2 3.4 1.6.1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.8 5.4-5.4 5.7.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A11.3 11.3 0 0 0 12 .7Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.2 9h3.6v11.5H3.2V9Zm5.8 0h3.4v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6v6.2h-3.6v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9V9Z"/></svg>`
};

function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[char]));
}

function appIcon(app) {
    if (app.icon === "profile") {
        return `<span class="app-icon" style="background:${app.color}"><img src="${CONFIG.avatar || "profileicon.png"}" alt=""></span>`;
    }
    if (iconSvgs[app.icon]) {
        return `<span class="app-icon" style="background:${app.color}">${iconSvgs[app.icon]}</span>`;
    }
    return `<span class="app-icon" style="background:${app.color}">${app.icon}</span>`;
}

function initBoot() {
    document.querySelector(".menu-trigger.apple").textContent = "";
    $("#search-button").innerHTML = "&#8984;K";
    if (!$("#top-music-button")) {
        $(".menu-right")?.insertAdjacentHTML("afterbegin", `<button class="menu-trigger top-music-button" id="top-music-button" title="Play music">&#9835;</button>`);
    }
    $("#music-play").innerHTML = "&#9654;";
    $("#music-prev").innerHTML = "&#9198;";
    $("#music-next").innerHTML = "&#9197;";
    $("#track-title").textContent = "Oorum Blood";
    $("#track-artist").textContent = "Dude - Sai Abhyankkar";
    if (!$("#music-embed")) {
        $(".music-widget")?.insertAdjacentHTML("beforeend", `<div id="music-embed" aria-hidden="true"></div>`);
    }

    $(".boot-card h1").textContent = "Tanvi OS";
    $(".boot-card p").textContent = "Creative Command Center booting";
    $$(".boot-specs span").forEach((span, index) => {
        const labels = [
            "Concept: premium desktop portfolio",
            "Motion: smooth glass interactions",
            "Workspaces: AI, projects, arcade, contact",
            "Ready: enter the command center"
        ];
        setTimeout(() => span.textContent = labels[index], 420 + index * 260);
    });

    $("#boot-ok").addEventListener("click", () => {
        $("#boot").classList.add("hidden");
        notify("Tanvi OS", "Welcome back. Finder is ready.");
        openWindow("finder");
    });

    setTimeout(() => {
        $("#boot").classList.add("intro-ready");
        $("#boot-ok").textContent = "Enter Tanvi OS";
    }, 1700);
}

function initClock() {
    const tick = () => {
        const now = new Date();
        const top = now.toLocaleString("en-IN", { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false });
        const big = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
        $("#local-time").textContent = top;
        $("#big-time").textContent = big;
    };
    tick();
    setInterval(tick, 1000);
}

function initMenus() {
    $$(".menu-trigger").forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            const menu = document.getElementById(trigger.dataset.menu);
            closeMenus(menu);
            if (!menu) return;
            const rect = trigger.getBoundingClientRect();
            menu.style.left = `${Math.min(rect.left, window.innerWidth - 260)}px`;
            menu.classList.toggle("open");
            trigger.classList.toggle("is-open", menu.classList.contains("open"));
        });
    });

    document.addEventListener("click", () => closeMenus());
    $("#menus").addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        event.stopPropagation();
        runAction(button.dataset);
        closeMenus();
    });
}

function closeMenus(except) {
    $$(".drop-menu").forEach((menu) => {
        if (menu !== except) menu.classList.remove("open");
    });
    $$(".menu-trigger").forEach((trigger) => {
        if (!except || trigger.dataset.menu !== except.id) trigger.classList.remove("is-open");
    });
}

function runAction(data) {
    if (data.action === "open") openWindow(data.app);
    if (data.action === "open-all") ["about", "projects", "experience", "tech", "certs", "terminal", "contact", "arcade", "github", "linkedin"].forEach(openWindow);
    if (data.action === "close-all") closeAll();
    if (data.action === "minimize-all") $$(".window").forEach((win) => win.classList.add("minimized"));
    if (data.action === "about-os") $("#about-modal").classList.remove("hidden");
    if (data.action === "about-close") $("#about-modal").classList.add("hidden");
    if (data.action === "mission-control") openMissionControl();
    if (data.action === "mission-close") $("#mission").classList.add("hidden");
    if (data.action === "email") window.location.href = `mailto:${CONFIG.email || "tanvikorada@gmail.com"}`;
    if (data.action === "external") openExternal(CONFIG.socials?.[data.url]);
}

function initDesktop() {
    $("#desktop-icons").innerHTML = apps
        .filter((app) => app.desktop)
        .map((app) => `<button class="desktop-icon" data-app="${app.id}">${appIcon(app)}<span>${app.title}</span></button>`)
        .join("");

    $("#dock").innerHTML = [
        "finder", "terminal", "about", "projects", "experience", "tech", "certs", "contact", "ai", "arcade",
        "divider", "github", "linkedin"
    ].map((id) => {
        if (id === "divider") return `<div class="dock-divider" aria-hidden="true"></div>`;
        const app = appById(id);
        return `<button class="dock-item" data-app="${id}" title="${app.title}">${appIcon(app)}</button>`;
    }).join("");

    document.addEventListener("dblclick", (event) => {
        const icon = event.target.closest(".desktop-icon");
        if (icon) openWindow(icon.dataset.app);
    });

    $("#desktop-icons").addEventListener("click", (event) => {
        const icon = event.target.closest(".desktop-icon");
        if (icon) focusIcon(icon);
    });

    $("#dock").addEventListener("click", (event) => {
        const item = event.target.closest(".dock-item");
        if (item) openWindow(item.dataset.app);
    });

    initFloatingWidgets();
    $$(".desktop-icon").forEach((icon) => makeFreeDraggable(icon, { clampTop: 34 }));

    $("#desktop").addEventListener("pointerdown", (event) => {
        if (event.target.closest(".window, #dock, #menus, #menubar, #widgets, .overlay, .desktop-icon, button, a, input")) return;
        if (state.openWindows.size) {
            scatterAndCloseWindows();
            return;
        }
        if (state.recentlyClosedApps.length) {
            const restoreApps = [...state.recentlyClosedApps].slice(0, 6);
            state.recentlyClosedApps = [];
            restoreApps.reverse().forEach(openWindow);
        }
    });
}

function initFloatingWidgets() {
    const widgets = $$("#widgets .widget").filter((widget) => !widget.classList.contains("command-widget"));
    $$("#widgets .command-widget").forEach((widget) => widget.remove());
    widgets.forEach((widget, index) => {
        const layout = [
            [20, 50], [20, 158], [20, 266], [20, 374],
            [270, 50], [270, 220], [270, 328]
        ];
        const [left, top] = layout[index] || [20 + index * 24, 56 + index * 24];
        widget.style.position = "fixed";
        widget.style.left = `${left}px`;
        widget.style.top = `${top}px`;
        widget.style.width = widget.classList.contains("wallpaper-widget") ? "238px" : "232px";
        widget.style.zIndex = String(20 + index);
        widget.classList.add("floating-widget");
        makeFreeDraggable(widget, { clampTop: 34 });
    });
}

function focusIcon(icon) {
    $$(".desktop-icon").forEach((item) => item.classList.remove("selected"));
    icon.classList.add("selected");
}

function openWindow(appId) {
    const app = appById(appId);
    if (!app) return;
    if (app.external) {
        app.external();
        return;
    }

    const existing = state.openWindows.get(appId);
    if (existing) {
        existing.classList.remove("minimized");
        focusWindow(existing, app.title);
        return;
    }

    const size = getWindowSize(appId);
    const win = document.createElement("section");
    win.className = `window ${appId}-window`;
    win.dataset.app = appId;
    win.style.width = size.width;
    win.style.height = size.height;
    win.style.left = `${Math.min(350 + state.openWindows.size * 28, window.innerWidth - 420)}px`;
    win.style.top = `${Math.min(62 + state.openWindows.size * 24, window.innerHeight - 360)}px`;
    win.style.zIndex = state.z++;
    win.innerHTML = `
        <header class="window-header">
            <div class="traffic">
                <button class="close" title="Close" aria-label="Close"></button>
                <button class="min" title="Minimize" aria-label="Minimize"></button>
                <button class="max" title="Zoom" aria-label="Zoom"></button>
            </div>
            <div class="window-title">${app.title}</div>
            <div class="window-actions">
                <button data-window-action="left">Left</button>
                <button data-window-action="right">Right</button>
                <button data-window-action="full">Full</button>
                <button data-window-action="top-left">TL</button>
                <button data-window-action="top-right">TR</button>
                <button data-window-action="bottom-left">BL</button>
                <button data-window-action="bottom-right">BR</button>
            </div>
        </header>
        ${windowFrame(appId)}
    `;

    $("#windows").appendChild(win);
    state.openWindows.set(appId, win);
    makeDraggable(win);
    renderContent(appId, $(".window-body", win));
    bindWindowControls(win, app);
    focusWindow(win, app.title);
    updateDock();
}

function getWindowSize(appId) {
    const sizes = {
        finder: { width: "760px", height: "520px" },
        about: { width: "860px", height: "560px" },
        projects: { width: "900px", height: "620px" },
        experience: { width: "860px", height: "590px" },
        tech: { width: "800px", height: "560px" },
        certs: { width: "790px", height: "560px" },
        terminal: { width: "790px", height: "520px" },
        contact: { width: "760px", height: "510px" },
        ai: { width: "460px", height: "600px" },
        arcade: { width: "780px", height: "610px" },
        github: { width: "720px", height: "500px" },
        linkedin: { width: "720px", height: "500px" }
    };
    return sizes[appId] || { width: "720px", height: "500px" };
}

function windowFrame(appId) {
    const sidebarApps = ["finder", "about", "projects", "experience", "tech", "certs", "contact"];
    if (!sidebarApps.includes(appId)) return `<div class="window-body"></div>`;
    const nav = [
        ["about", "About Me"],
        ["projects", "Projects"],
        ["experience", "Experience"],
        ["tech", "Tech Stack"],
        ["certs", "Certifications"],
        ["contact", "Contact"]
    ].map(([id, label]) => `<button class="${id === appId ? "active" : ""}" data-open="${id}">${label}</button>`).join("");
    return `<div class="window-shell"><aside class="window-sidebar">${nav}</aside><div class="window-body"></div></div>`;
}

function bindWindowControls(win, app) {
    $(".close", win).addEventListener("click", () => closeWindow(app.id));
    $(".min", win).addEventListener("click", () => {
        win.classList.add("minimized");
        updateActiveApp("Tanvi OS");
    });
    $(".max", win).addEventListener("click", () => win.classList.toggle("maximized"));
    $$("[data-window-action]", win).forEach((button) => {
        button.addEventListener("click", () => tileWindow(win, button.dataset.windowAction));
    });
    win.addEventListener("pointerdown", () => focusWindow(win, app.title));
    $$(".window-sidebar button", win).forEach((button) => {
        button.addEventListener("click", () => openWindow(button.dataset.open));
    });
}

function tileWindow(win, mode) {
    win.classList.remove("maximized");
    if (mode === "full") {
        win.classList.add("maximized");
        return;
    }
    if (mode.includes("-")) {
        const left = mode.endsWith("left") ? "8px" : "calc(50vw + 8px)";
        const top = mode.startsWith("top") ? "8px" : "calc(50vh - 30px)";
        win.style.top = top;
        win.style.left = left;
        win.style.width = "calc(50vw - 16px)";
        win.style.height = "calc(50vh - 78px)";
        return;
    }
    win.style.top = "8px";
    win.style.height = "calc(100vh - 124px)";
    win.style.width = "calc(50vw - 16px)";
    win.style.left = mode === "left" ? "8px" : "calc(50vw + 8px)";
}

function closeWindow(appId, options = {}) {
    const win = state.openWindows.get(appId);
    if (!win) return;
    if (appId === "arcade") {
        currentIsPlaying1 = false;
        currentIsPlaying2 = false;
        currentIsPlaying3 = false;
        currentIsPlaying4 = false;
        currentIsPlaying6 = false;
    }
    win.remove();
    state.openWindows.delete(appId);
    if (!options.skipRecent) {
        state.recentlyClosedApps = [appId, ...state.recentlyClosedApps.filter((id) => id !== appId)].slice(0, 8);
    }
    updateDock();
    updateActiveApp("Tanvi OS");
}

function closeAll(options = {}) {
    [...state.openWindows.keys()].forEach((appId) => closeWindow(appId, options));
}

function focusWindow(win, title) {
    win.style.zIndex = state.z++;
    updateActiveApp(title);
}

function updateActiveApp(title) {
    state.activeApp = title;
    $(".active-app").textContent = title;
}

function updateDock() {
    $("#desktop").classList.toggle("has-open-windows", state.openWindows.size > 0);
    $$(".dock-item").forEach((item) => {
        item.classList.toggle("open", state.openWindows.has(item.dataset.app));
    });
}

function makeDraggable(win) {
    const header = $(".window-header", win);
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let dragging = false;

    header.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) return;
        if (win.classList.contains("maximized")) return;
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startLeft = win.offsetLeft;
        startTop = win.offsetTop;
        header.setPointerCapture(event.pointerId);
    });

    header.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const nextLeft = Math.max(0, Math.min(window.innerWidth - 120, startLeft + event.clientX - startX));
        const nextTop = Math.max(0, Math.min(window.innerHeight - 90, startTop + event.clientY - startY));
        win.style.left = `${nextLeft}px`;
        win.style.top = `${nextTop}px`;
    });

    header.addEventListener("pointerup", () => {
        dragging = false;
    });
}

function makeFreeDraggable(el, options = {}) {
    if (!el) return;
    const handle = options.handle ? el.querySelector(options.handle) : el;
    if (!handle) return;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let dragging = false;
    handle.style.cursor = "grab";
    handle.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button, a, input")) return;
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        const rect = el.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        el.style.position = "fixed";
        el.style.left = `${startLeft}px`;
        el.style.top = `${startTop}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";
        el.style.zIndex = String(state.z++);
        handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const minTop = options.clampTop || 0;
        const nextLeft = Math.max(0, Math.min(window.innerWidth - Math.min(el.offsetWidth, 120), startLeft + event.clientX - startX));
        const nextTop = Math.max(minTop, Math.min(window.innerHeight - 92, startTop + event.clientY - startY));
        el.style.left = `${nextLeft}px`;
        el.style.top = `${nextTop}px`;
    });
    handle.addEventListener("pointerup", () => {
        dragging = false;
        handle.style.cursor = "grab";
    });
}

function scatterAndCloseWindows() {
    const wins = [...state.openWindows.values()].filter((win) => !win.classList.contains("minimized"));
    if (!wins.length) return;
    wins.forEach((win, index) => {
        win.classList.remove("maximized");
        const rect = win.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = centerX < window.innerWidth / 2 ? -1 : 1;
        const dy = centerY < window.innerHeight / 2 ? -1 : 1;
        const driftX = dx * (150 + index * 38);
        const driftY = dy * (90 + index * 24);
        win.classList.add("scatter-closing");
        win.style.transform = `translate(${driftX}px, ${driftY}px) rotate(${dx * (8 + index * 2)}deg) scale(.82)`;
        win.style.opacity = "0";
    });
    setTimeout(() => wins.forEach((win) => closeWindow(win.dataset.app)), 360);
}

function renderContent(appId, body) {
    if (appId === "finder") renderFinder(body);
    if (appId === "about") renderAbout(body);
    if (appId === "projects") renderProjects(body);
    if (appId === "experience") renderExperience(body);
    if (appId === "tech") renderTech(body);
    if (appId === "certs") renderCerts(body);
    if (appId === "terminal") renderTerminal(body);
    if (appId === "contact") renderContact(body);
    if (appId === "articles") renderArticles(body);
    if (appId === "ai") renderAI(body);
    if (appId === "arcade") renderArcade(body);
    if (appId === "github") renderGithub(body);
    if (appId === "linkedin") renderLinkedIn(body);
}

function renderFinder(body) {
    body.innerHTML = `
        <div class="hero-profile">
            <img src="${CONFIG.avatar || "profileicon.png"}" alt="${escapeHtml(CONFIG.name)}">
            <div>
                <div class="eyebrow">portfolio://home</div>
                <h1>${escapeHtml(CONFIG.name || "K. Tanvi")}</h1>
                <p class="lead">Lead creative technologist and team leader building memorable product experiences, elegant brand systems, and AI-powered workflows that scale.</p>
                <p class="lead subtle">Guiding cross-functional product teams with a designer’s eye, a developer’s discipline, and a storyteller’s clarity.</p>
                <div class="actions">
                    <button class="pill-button primary" data-open-app="about">Open Profile</button>
                    <button class="pill-button" data-open-app="projects">View Work</button>
                    <a class="link-button" href="mailto:${CONFIG.email}">Email</a>
                </div>
            </div>
        </div>
        <div class="stats-grid">
            <div class="stat"><strong>${CONFIG.projects?.length || 4}</strong><span>Featured projects</span></div>
            <div class="stat"><strong>${CONFIG.experience?.length || 4}</strong><span>Internships</span></div>
            <div class="stat"><strong>${CONFIG.certs?.length || 10}+</strong><span>Certifications</span></div>
            <div class="stat"><strong>2028</strong><span>SRMIST CSE</span></div>
        </div>
    `;
    bindOpenButtons(body);
}

function renderAbout(body) {
    body.innerHTML = `
        <div class="eyebrow">about.txt</div>
        <h2>${escapeHtml(CONFIG.title || "AI Developer")}</h2>
        <p class="lead">${escapeHtml(CONFIG.about?.bio || "")}</p>
        <div class="card-grid">
            ${(CONFIG.about?.interests || []).map((interest) => `
                <article class="content-card">
                    <h3>${escapeHtml(interest)}</h3>
                    <p>Focused on practical systems, clean interfaces, and production-aware engineering.</p>
                </article>
            `).join("")}
        </div>
    `;
}

function renderProjects(body) {
    body.innerHTML = `
        <div class="eyebrow">open-source.app</div>
        <h2>Featured Projects</h2>
        <p class="lead">Selected work from Tanvi's AI, web, and backend portfolio.</p>
        <div class="card-grid">
            ${(CONFIG.projects || []).map((project) => `
                <article class="content-card">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <div class="tag-row">${(project.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
                    <div class="actions">
                        <a class="link-button" href="${project.link}" target="_blank" rel="noreferrer">Open Project</a>
                        ${project.github ? `<a class="link-button" href="${project.github}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
                    </div>
                </article>
            `).join("")}
        </div>
    `;
}

function renderExperience(body) {
    body.innerHTML = `
        <div class="eyebrow">career.timeline</div>
        <h2>Experience</h2>
        <div class="timeline">
            ${(CONFIG.experience || []).map((job) => `
                <article class="timeline-item">
                    <div class="meta">${escapeHtml(job.period)}</div>
                    <div>
                        <h3>${escapeHtml(job.role)}</h3>
                        <p class="meta">${escapeHtml(job.company)}</p>
                        <p>${escapeHtml(job.desc)}</p>
                    </div>
                </article>
            `).join("")}
        </div>
    `;
}

function renderTech(body) {
    const skills = CONFIG.about?.skills || [];
    body.innerHTML = `
        <div class="eyebrow">skills.json</div>
        <h2>Tech Stack</h2>
        <p class="lead">Languages, tools, cloud platforms, and AI workflows Tanvi works with.</p>
        <div class="skill-grid">
            ${skills.map((skill) => `<div class="content-card"><h3>${escapeHtml(skill)}</h3><p>Ready to use in product-oriented builds.</p></div>`).join("")}
        </div>
    `;
}

function renderCerts(body) {
    body.innerHTML = `
        <div class="eyebrow">certificates.folder</div>
        <h2>Certifications</h2>
        <div class="card-grid">
            ${(CONFIG.certs || []).map((cert) => `
                <article class="content-card">
                    <h3>${escapeHtml(cert.name)}</h3>
                    <p>${escapeHtml(cert.issuer)}</p>
                </article>
            `).join("")}
        </div>
    `;
}

function renderTerminal(body) {
    body.innerHTML = `
        <div class="terminal-body">
            <div id="terminal-output">
                <div class="terminal-line">tanvi@portfolio ~ % <span>whoami</span></div>
                <div class="terminal-output">${escapeHtml(CONFIG.name)} - ${escapeHtml(CONFIG.title)}</div>
                <div class="terminal-line">tanvi@portfolio ~ % <span>cat contact.txt</span></div>
                <div class="terminal-output">${escapeHtml(CONFIG.email)} | ${escapeHtml(CONFIG.location)}</div>
                <div class="terminal-line">tanvi@portfolio ~ % <span>help</span></div>
                <div class="terminal-output">Commands: help, bio, skills, projects, certs, contact, clear</div>
            </div>
            <div class="terminal-input-row"><span class="terminal-line">tanvi@portfolio ~ %</span><input class="terminal-input" autocomplete="off" autofocus></div>
        </div>
    `;
    const input = $(".terminal-input", body);
    input.focus();
    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const value = input.value.trim().toLowerCase();
        input.value = "";
        runTerminalCommand(body, value);
    });
}

function runTerminalCommand(body, value) {
    const out = $("#terminal-output", body);
    const responses = CONFIG.terminal?.commands || {};
    const answer = value === "clear" ? "" : responses[value] || `Command not found: ${escapeHtml(value)}. Try "help".`;
    if (value === "clear") {
        out.innerHTML = "";
        return;
    }
    out.insertAdjacentHTML("beforeend", `
        <div class="terminal-line">tanvi@portfolio ~ % <span>${escapeHtml(value)}</span></div>
        <div class="terminal-output">${escapeHtml(answer)}</div>
    `);
    out.scrollIntoView({ block: "end" });
}

function renderContact(body) {
    body.innerHTML = `
        <div class="eyebrow">contact.card</div>
        <h2>Contact</h2>
        <p class="lead">Open to internships, collaboration, AI product builds, and full stack work.</p>
        <div class="contact-grid">
            <article class="content-card">
                <h3>Email</h3>
                <p><a href="mailto:${CONFIG.email}">${escapeHtml(CONFIG.email)}</a></p>
                <h3 style="margin-top:18px">Phone</h3>
                <p>${escapeHtml(CONFIG.phone)}</p>
                <h3 style="margin-top:18px">Location</h3>
                <p>${escapeHtml(CONFIG.location)}</p>
            </article>
            <article class="content-card">
                <h3>Social</h3>
                <div class="actions">
                    <a class="link-button" href="${CONFIG.socials?.github}" target="_blank" rel="noreferrer">GitHub</a>
                    <a class="link-button" href="${CONFIG.socials?.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
                    <a class="link-button" href="${CONFIG.socials?.instagram}" target="_blank" rel="noreferrer">Instagram</a>
                </div>
            </article>
        </div>
    `;
}

function renderArticles(body) {
    body.innerHTML = `
        <div class="eyebrow">articles.news</div>
        <h2>Articles</h2>
        <div class="card-grid">
            <article class="content-card"><h3>Building AI-first portfolio systems</h3><p>A note on turning a portfolio into an interactive operating system.</p></article>
            <article class="content-card"><h3>Prompt engineering as product architecture</h3><p>How task decomposition and context design shape useful AI workflows.</p></article>
        </div>
    `;
}

function renderAI(body) {
    body.innerHTML = `
        <div class="terminal-body" style="display:flex;flex-direction:column">
            <div id="chat-output" style="flex:1;overflow:auto"></div>
            <div class="terminal-input-row"><span class="terminal-line">TanviAI ></span><input class="terminal-input" placeholder="Ask about skills, projects, contact"></div>
        </div>
    `;
    const output = $("#chat-output", body);
    const input = $(".terminal-input", body);
    const add = (who, text) => output.insertAdjacentHTML("beforeend", `<div class="terminal-output"><strong>${who}:</strong> ${escapeHtml(text)}</div>`);
    add("TanviAI", "Hello. Ask me about Tanvi's skills, projects, experience, or contact.");
    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" || !input.value.trim()) return;
        const q = input.value.toLowerCase();
        add("You", input.value);
        input.value = "";
        const responses = CONFIG.ai?.responses || {};
        const key = Object.keys(responses).find((item) => q.includes(item));
        add("TanviAI", responses[key] || responses.default || "Tanvi builds AI and full stack systems.");
        output.scrollTop = output.scrollHeight;
    });
}

function renderGithub(body) {
    body.innerHTML = `
        <div class="profile-head">
            ${appIcon(appById("github"))}
            <div>
                <div class="eyebrow">github.com/Tanvikorada</div>
                <h2>GitHub</h2>
                <p class="lead">Projects, repos, Java builds, AI experiments, and full stack work.</p>
            </div>
        </div>
        <div class="stats-grid">
            <div class="stat"><strong>${CONFIG.projects?.length || 4}</strong><span>Featured repos</span></div>
            <div class="stat"><strong>AI</strong><span>Primary focus</span></div>
            <div class="stat"><strong>Java</strong><span>Backend practice</span></div>
            <div class="stat"><strong>Web</strong><span>Frontend systems</span></div>
        </div>
        <div class="card-grid">
            ${(CONFIG.projects || []).map((project) => `
                <article class="content-card">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                    <div class="actions">
                        <a class="link-button" href="${project.github || project.link}" target="_blank" rel="noreferrer">Open GitHub</a>
                    </div>
                </article>
            `).join("")}
        </div>
        <div class="actions"><a class="pill-button primary" href="${CONFIG.socials?.github}" target="_blank" rel="noreferrer">Open full GitHub profile</a></div>
    `;
}

function renderLinkedIn(body) {
    body.innerHTML = `
        <div class="profile-head">
            ${appIcon(appById("linkedin"))}
            <div>
                <div class="eyebrow">linkedin.com/in/korada-tanvi</div>
                <h2>LinkedIn</h2>
                <p class="lead">Professional profile for internships, collaborations, and AI/full stack opportunities.</p>
            </div>
        </div>
        <div class="badge-row">
            <span>AI Developer</span><span>Full Stack Builder</span><span>SRMIST CSE</span><span>Open to internships</span>
        </div>
        <div class="timeline">
            ${(CONFIG.experience || []).slice(0, 5).map((job) => `
                <article class="timeline-item">
                    <div class="meta">${escapeHtml(job.period)}</div>
                    <div>
                        <h3>${escapeHtml(job.role)}</h3>
                        <p class="meta">${escapeHtml(job.company)}</p>
                        <p>${escapeHtml(job.desc)}</p>
                    </div>
                </article>
            `).join("")}
        </div>
        <div class="actions"><a class="pill-button primary" href="${CONFIG.socials?.linkedin}" target="_blank" rel="noreferrer">Open full LinkedIn profile</a></div>
    `;
}

function renderArcade(body) {
    body.innerHTML = `
        <div class="suite-wrap" id="arcade">
            <div class="suite-bar">
                <div class="suite-header-left">
                    <div><span class="td r" style="display:inline-block"></span><span class="td y" style="display:inline-block;margin:0 4px"></span><span class="td g" style="display:inline-block"></span></div>
                    <span class="suite-title">Developer Arcade</span>
                </div>
                <div class="suite-tabs">
                    <span class="suite-tab active" data-tab="1">Neural.exe</span>
                    <span class="suite-tab" data-tab="2">Runner.exe</span>
                    <span class="suite-tab" data-tab="3">Router.exe</span>
                    <span class="suite-tab" data-tab="4">Snake.exe</span>
                    <span class="suite-tab" data-tab="5">Memory.exe</span>
                    <span class="suite-tab" data-tab="6">Pong.exe</span>
                </div>
                <span class="suite-score" id="suite-score">Model Acc: 0%</span>
            </div>
            <div class="suite-body">
                <div class="suite-panel active" id="panel-1">
                    <canvas id="gameCanvas" class="game2-canvas"></canvas>
                    <div class="game2-overlay" id="game-overlay">
                        <div class="overlay-msg" id="game-msg">Train the AI Model?</div>
                        <button class="suite-btn btn-g" id="game-start">Initialize Training</button>
                    </div>
                </div>
                <div class="suite-panel" id="panel-2">
                    <canvas id="runCanvas" class="run-canvas" width="700" height="360"></canvas>
                    <div class="run-overlay" id="run-overlay">
                        <div class="overlay-msg" id="run-msg">Deploy to Production (Hard Mode)?</div>
                        <button class="suite-btn btn-b" id="run-start">Execute script</button>
                    </div>
                </div>
                <div class="suite-panel" id="panel-3">
                    <canvas id="routerCanvas" class="router-canvas" width="700" height="360"></canvas>
                    <div class="router-overlay" id="router-overlay">
                        <div class="overlay-msg" id="router-msg">Route incoming API Requests?</div>
                        <button class="suite-btn btn-p" id="router-start">Start Server</button>
                    </div>
                </div>
                <div class="suite-panel" id="panel-4">
                    <canvas id="arcadeSnakeCanvas" class="router-canvas" width="700" height="360"></canvas>
                    <div class="router-overlay" id="snake-overlay">
                        <div class="overlay-msg" id="snake-msg">Boot Snake Neon?</div>
                        <button class="suite-btn btn-g" id="snake-start">Start Snake</button>
                    </div>
                </div>
                <div class="suite-panel" id="panel-5">
                    <div id="memory-board" class="memory-board"></div>
                    <div class="router-overlay" id="memory-overlay">
                        <div class="overlay-msg" id="memory-msg">Match the stack pairs.</div>
                        <button class="suite-btn btn-b" id="memory-start">Shuffle Cards</button>
                    </div>
                </div>
                <div class="suite-panel" id="panel-6">
                    <canvas id="pongCanvas" class="router-canvas" width="700" height="360"></canvas>
                    <div class="router-overlay" id="pong-overlay">
                        <div class="overlay-msg" id="pong-msg">Start Pong Debug?</div>
                        <button class="suite-btn btn-p" id="pong-start">Launch Pong</button>
                    </div>
                </div>
            </div>
            <div class="suite-footer" id="suite-footer"></div>
        </div>
    `;
    initSuite();
}

function bindOpenButtons(scope) {
    $$("[data-open-app]", scope).forEach((button) => {
        button.addEventListener("click", () => openWindow(button.dataset.openApp));
    });
}

function initSpotlight() {
    $("#search-button").addEventListener("click", showSpotlight);
    $("#spotlight").addEventListener("click", (event) => {
        if (event.target.id === "spotlight") hideSpotlight();
    });
    $("#spotlight-input").addEventListener("input", renderSpotlightResults);
    $("#spotlight-input").addEventListener("keydown", (event) => {
        const results = $$(".spotlight-result");
        if (event.key === "ArrowDown") state.spotlightIndex = Math.min(results.length - 1, state.spotlightIndex + 1);
        if (event.key === "ArrowUp") state.spotlightIndex = Math.max(0, state.spotlightIndex - 1);
        if (event.key === "Enter" && results[state.spotlightIndex]) {
            openWindow(results[state.spotlightIndex].dataset.app);
            hideSpotlight();
        }
        if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            updateSpotlightActive();
        }
    });
}

function showSpotlight() {
    $("#spotlight").classList.remove("hidden");
    $("#spotlight-input").value = "";
    state.spotlightIndex = 0;
    renderSpotlightResults();
    $("#spotlight-input").focus();
}

function hideSpotlight() {
    $("#spotlight").classList.add("hidden");
}

function renderSpotlightResults() {
    const query = $("#spotlight-input").value.toLowerCase();
    const results = apps.filter((app) => `${app.title} ${app.id}`.toLowerCase().includes(query)).slice(0, 8);
    $("#spotlight-results").innerHTML = results.map((app, index) => `
        <button class="spotlight-result ${index === state.spotlightIndex ? "active" : ""}" data-app="${app.id}">
            ${appIcon(app)}
            <div><strong>${app.title}</strong><p>Open ${app.title} in Tanvi OS</p></div>
        </button>
    `).join("");
    $$(".spotlight-result").forEach((button) => {
        button.addEventListener("click", () => {
            openWindow(button.dataset.app);
            hideSpotlight();
        });
    });
}

function updateSpotlightActive() {
    $$(".spotlight-result").forEach((item, index) => item.classList.toggle("active", index === state.spotlightIndex));
}

function openMissionControl() {
    const wins = [...state.openWindows.entries()];
    $("#mission-grid").innerHTML = wins.length
        ? wins.map(([id]) => `<button class="mission-card" data-app="${id}">${appIcon(appById(id))}<strong>${appById(id).title}</strong></button>`).join("")
        : `<div class="mission-card"><strong>No open windows</strong></div>`;
    $("#mission").classList.remove("hidden");
    $$("#mission-grid [data-app]").forEach((button) => {
        button.addEventListener("click", () => {
            $("#mission").classList.add("hidden");
            openWindow(button.dataset.app);
        });
    });
}

function initWallpaper() {
    const canvas = $("#wallpaper");
    const ctx = canvas.getContext("2d");
    $("#desktop").dataset.theme = "mac-sonoma";
    $$(".wallpaper-widget button").forEach((item) => item.classList.toggle("active", item.dataset.theme === "mac-sonoma"));

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        state.wallpaperPoints = Array.from({ length: 48 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.8 + 0.5
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,.42)";
        state.wallpaperPoints.forEach((point) => {
            point.x += point.vx;
            point.y += point.vy;
            if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    $$(".wallpaper-widget button").forEach((button) => {
        button.addEventListener("click", () => {
            $$(".wallpaper-widget button").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            $("#desktop").dataset.theme = button.dataset.theme;
        });
    });
}

function initHeatmap() {
    $("#heatmap").innerHTML = Array.from({ length: 65 }, () => "<i></i>").join("");
}

function initKeyboard() {
    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if ((event.metaKey || event.ctrlKey) && key === "k") {
            event.preventDefault();
            showSpotlight();
        }
        if ((event.metaKey || event.ctrlKey) && key === "t") {
            event.preventDefault();
            openWindow("terminal");
        }
        if (event.key === "Escape") {
            hideSpotlight();
            $("#mission").classList.add("hidden");
            $("#about-modal").classList.add("hidden");
            closeMenus();
        }
    });

    document.body.addEventListener("click", (event) => {
        const closer = event.target.closest("[data-action]");
        if (closer) runAction(closer.dataset);
    });
}

function initMusic() {
    const tracks = [
        {
            title: "Oorum Blood",
            artist: "Dude - Sai Abhyankkar",
            src: "song.m4a"
        }
    ];
    let index = 0;
    let playing = false;
    let progress = 0;
    const title = $("#track-title");
    const artist = $("#track-artist");
    const bar = $("#music-progress");
    const time = $("#music-time");
    const play = $("#music-play");
    const embedContainer = $("#music-embed");
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    const sync = () => {
        const track = tracks[index];
        if (title) title.textContent = track.title;
        if (artist) artist.textContent = track.artist;
        if (play) play.innerHTML = playing ? "&#9208;" : "&#9654;";
        $("#top-music-button")?.classList.toggle("is-playing", playing);
    };

    const setPlaying = async (next) => {
        playing = next;
        const track = tracks[index];
        if (playing) {
            if (embedContainer) embedContainer.innerHTML = "";
            if (!audio.src || !audio.src.endsWith(track.src)) {
                audio.src = track.src;
            }
            try {
                await audio.play();
            } catch (error) {
                playing = false;
                console.warn("Autoplay blocked or audio error:", error);
            }
        } else {
            audio.pause();
        }
        sync();
    };

    $("#music-prev")?.addEventListener("click", () => {
        index = (index - 1 + tracks.length) % tracks.length;
        setPlaying(playing);
    });
    $("#music-next")?.addEventListener("click", () => {
        index = (index + 1) % tracks.length;
        setPlaying(playing);
    });
    play?.addEventListener("click", () => setPlaying(!playing));
    $("#top-music-button")?.addEventListener("click", () => setPlaying(!playing));

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration || tracks[index].youtubeId) return;
        progress = (audio.currentTime / audio.duration) * 100;
        if (bar) bar.style.width = `${progress}%`;
        const seconds = Math.floor(audio.currentTime);
        if (time) time.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    });
    audio.addEventListener("ended", () => {
        index = (index + 1) % tracks.length;
        setPlaying(true);
    });
    sync();
}

function openExternal(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
}

function notify(title, message) {
    const toast = document.createElement("div");
    toast.className = "notification";
    toast.innerHTML = `<img src="${CONFIG.avatar || "profileicon.png"}" alt=""><div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span></div>`;
    $("#notification-area").appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(30px)";
        setTimeout(() => toast.remove(), 250);
    }, 4200);
}

let currentIsPlaying1 = false;
let currentIsPlaying2 = false;
let currentIsPlaying3 = false;
let currentIsPlaying4 = false;
let currentIsPlaying6 = false;

function initSuite() {
    const tabs = document.querySelectorAll(".suite-tab");
    const panels = document.querySelectorAll(".suite-panel");
    const scoreEl = document.getElementById("suite-score");
    const footer = document.getElementById("suite-footer");
    if (!tabs.length || !scoreEl || !footer) return;

    const footers = {
        1: '<span><strong style="color:var(--green)">GAME 1:</strong> Move your mouse (or drag) to rotate the Firewall.</span><span>Filter out <span style="color:#ff5f57">[BUG / BIAS]</span> and let <span style="color:#4ade80">[DATA / LOGIC]</span> reach the core!</span>',
        2: '<span><strong style="color:var(--blue)">GAME 2:</strong> Dodge <span style="color:#ff5f57">[BUGS]</span> and collect <span style="color:#7dd3fc">[AI]</span> tokens.</span><span>Press <span class="run-key" style="background:var(--border2);padding:.1rem .4rem;border-radius:4px;color:var(--text)">Space</span> or Tap to JUMP (Double jump enabled!)</span>',
        3: '<span><strong style="color:var(--purple)">GAME 3:</strong> Click the matching Server Box to route incoming API Packets before they crash!</span><span>Match GET with GET, POST, etc.</span>',
        4: '<span><strong style="color:var(--green)">GAME 4:</strong> Classic Snake with arrow keys.</span><span>Eat tokens, avoid your own trail.</span>',
        5: '<span><strong style="color:var(--blue)">GAME 5:</strong> Memory match for developer tools.</span><span>Flip two cards and clear the board.</span>',
        6: '<span><strong style="color:var(--purple)">GAME 6:</strong> Pong Debug.</span><span>Move with mouse or touch and keep the packet alive.</span>'
    };

    footer.innerHTML = footers[1];
    initOrbital();

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const id = tab.getAttribute("data-tab");
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(`panel-${id}`)?.classList.add("active");

            currentIsPlaying1 = false;
            currentIsPlaying2 = false;
            currentIsPlaying3 = false;
            currentIsPlaying4 = false;
            currentIsPlaying6 = false;

            scoreEl.innerText = id === "1" ? "Model Acc: 0%" : id === "2" ? "Score: 00000" : id === "3" ? "Uptime: 0s" : "Score: 0";
            scoreEl.style.color = id === "1" || id === "4" ? "var(--green)" : id === "2" || id === "5" ? "var(--blue)" : "var(--purple)";
            footer.innerHTML = footers[id];

            if (id === "1") initOrbital();
            if (id === "2") initRunner();
            if (id === "3") initRouter();
            if (id === "4") initArcadeSnake();
            if (id === "5") initMemoryGame();
            if (id === "6") initPongGame();
        });
    });
}

function initOrbital() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const msgEl = document.getElementById("game-msg");
    const overlay = document.getElementById("game-overlay");
    const startBtn = document.getElementById("game-start");
    const accEl = document.getElementById("suite-score");

    let cx, cy;
    const resize = () => {
        const w = Math.min(window.innerWidth - 40, 600);
        const parent = canvas.parentElement;
        if (parent.offsetWidth > 0) canvas.width = parent.offsetWidth;
        else canvas.width = w;
        canvas.height = 360;
        cx = canvas.width / 2;
        cy = 180;
    };
    window.addEventListener("resize", resize);
    resize();

    currentIsPlaying1 = false;
    let health = 100;
    let accuracy = 0;
    let frame = 0;
    let shieldAngle = 0;
    let items = [];
    let particles = [];
    let animId;

    const getAngle = (x, y) => {
        const rect = canvas.getBoundingClientRect();
        shieldAngle = Math.atan2(y - rect.top - cy, x - rect.left - cx);
    };

    canvas.onmousemove = e => { if (currentIsPlaying1) getAngle(e.clientX, e.clientY); };
    canvas.ontouchmove = e => { if (currentIsPlaying1) { e.preventDefault(); getAngle(e.touches[0].clientX, e.touches[0].clientY); } };

    function reset() {
        health = 100; accuracy = 0; frame = 0; items = []; particles = [];
        currentIsPlaying1 = true; overlay.classList.add("hidden");
        accEl.innerText = "Model Acc: 0%";
        accEl.style.color = "var(--green)";
        if (animId) cancelAnimationFrame(animId);
        loop();
    }

    function spawnItem() {
        const rate = Math.max(20, 80 - Math.floor(accuracy / 2));
        if (frame % rate === 0) {
            const angle = Math.random() * Math.PI * 2;
            const isBad = Math.random() > 0.45;
            const dist = Math.max(cx, cy) + 50;
            items.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, angle, dist, isBad, speed: 1.5 + Math.random() * 1.5 + (accuracy / 40), text: isBad ? (Math.random() > 0.5 ? "BUG" : "BIAS") : (Math.random() > 0.5 ? "DATA" : "LOGIC") });
        }
    }

    function spawnParticles(x, y, color) {
        for (let i = 0; i < 8; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 1, color });
    }

    function update() {
        if (!currentIsPlaying1) return;
        for (let i = items.length - 1; i >= 0; i--) {
            let it = items[i];
            it.dist -= it.speed;
            it.x = cx + Math.cos(it.angle) * it.dist;
            it.y = cy + Math.sin(it.angle) * it.dist;
            if (it.dist <= 65 && it.dist >= 55) {
                let adiff = Math.abs(it.angle - shieldAngle);
                if (adiff > Math.PI) adiff = Math.PI * 2 - adiff;
                if (adiff < 0.6) { if (it.isBad) spawnParticles(it.x, it.y, "#ff5f57"); else spawnParticles(it.x, it.y, "#7dd3fc"); items.splice(i, 1); continue; }
            }
            if (it.dist <= 25) {
                if (it.isBad) { health -= 15; spawnParticles(cx, cy, "#ff5f57"); }
                else { accuracy += 5; spawnParticles(cx, cy, "#4ade80"); }
                items.splice(i, 1);
            }
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx; p.y += p.vy; p.life -= 0.05;
            if (p.life <= 0) particles.splice(i, 1);
        }
        accEl.innerText = "Model Acc: " + Math.floor(accuracy) + "%";
        accEl.style.color = accuracy >= 100 ? "#fbbf24" : "#4ade80";
        if (health <= 0) gameOver(false);
        if (accuracy >= 100) gameOver(true);
        spawnItem();
        frame++;
    }

    function draw() {
        ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#1f1f1f"; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = 0; i < canvas.width; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
        for (let i = 0; i < canvas.height; i += 40) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
        ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 25 + Math.sin(frame * 0.1) * 3, 0, Math.PI * 2);
        ctx.fillStyle = health > 30 ? "rgba(74,222,128,0.2)" : "rgba(255,95,87,0.3)"; ctx.fill();
        ctx.strokeStyle = health > 30 ? "#4ade80" : "#ff5f57"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "10px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(Math.floor(health) + "%", cx, cy);
        ctx.beginPath(); ctx.arc(cx, cy, 60, shieldAngle - 0.6, shieldAngle + 0.6);
        ctx.strokeStyle = "#7dd3fc"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(125,211,252,0.1)"; ctx.lineWidth = 1; ctx.stroke();
        items.forEach(it => { ctx.fillStyle = it.isBad ? "#ff5f57" : "#4ade80"; ctx.font = "bold 11px monospace"; ctx.fillText(it.text, it.x, it.y); });
        particles.forEach(p => { ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life); ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; });
    }

    function loop() {
        update(); draw();
        if (currentIsPlaying1) animId = requestAnimationFrame(loop);
    }

    function gameOver(won) {
        currentIsPlaying1 = false;
        overlay.classList.remove("hidden");
        if (won) { msgEl.innerHTML = "MODEL TRAINED! 100% ACCURACY"; msgEl.style.color = "#fbbf24"; startBtn.innerText = "Retrain Model"; }
        else { msgEl.innerHTML = "CORE BREACHED."; msgEl.style.color = "#ff5f57"; startBtn.innerText = "Reboot Core"; }
    }

    startBtn.onclick = reset;
    draw();
}

function initRunner() {
    const canvas = document.getElementById("runCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("suite-score");
    const startBtn = document.getElementById("run-start");
    const overlay = document.getElementById("run-overlay");
    const msgEl = document.getElementById("run-msg");

    const resize = () => { if (window.innerWidth < 740) canvas.width = window.innerWidth - 60; else canvas.width = 700; };
    window.addEventListener("resize", resize); resize();

    currentIsPlaying2 = false;
    let score = 0; let frame = 0; let speed = 6;
    let animationId;
    const char = { x: 50, y: 150, w: 32, h: 32, dy: 0, jump: -11, grav: 0.75, jumps: 0 };
    let obstacles = []; let tokens = [];

    function reset() {
        char.y = 280; char.dy = 0; char.jumps = 0;
        obstacles = []; tokens = []; score = 0; frame = 0; speed = Math.max(6, canvas.width / 115);
        scoreEl.innerText = "Score: 00000";
        overlay.classList.add("hidden");
        currentIsPlaying2 = true;
        if (animationId) cancelAnimationFrame(animationId);
        loop();
    }

    function spawn() {
        const spawnRate = Math.max(45, 110 - speed * 8);
        if (frame % Math.floor(spawnRate) === 0) {
            if (Math.random() > 0.4) obstacles.push({ x: canvas.width, y: 280, w: 26, h: 30, text: "BUG" });
            else tokens.push({ x: canvas.width, y: 220 + Math.random() * 25, w: 22, h: 22, text: "AI", active: true });
        }
    }

    function update() {
        if (!currentIsPlaying2) return;
        char.dy += char.grav; char.y += char.dy;
        if (char.y + char.h >= 310) { char.y = 310 - char.h; char.dy = 0; char.jumps = 0; }
        for (let i = 0; i < obstacles.length; i++) {
            let obs = obstacles[i]; obs.x -= speed;
            if (char.x + 4 < obs.x + obs.w && char.x + char.w - 4 > obs.x && char.y + 4 < obs.y + obs.h && char.y + char.h - 4 > obs.y) gameOver();
        }
        for (let i = 0; i < tokens.length; i++) {
            let tok = tokens[i]; tok.x -= speed;
            if (tok.active && char.x < tok.x + tok.w && char.x + char.w > tok.x && char.y < tok.y + tok.h && char.y + char.h > tok.y) { tok.active = false; score += 500; }
        }
        obstacles = obstacles.filter(o => o.x > -50); tokens = tokens.filter(t => t.x > -50);
        score += 2;
        scoreEl.innerText = "Score: " + Math.floor(score / 10).toString().padStart(5, "0");
        if (frame % 200 === 0 && speed < 16) speed += 0.6;
        spawn(); frame++;
    }

    function draw() {
        ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#2a2a2a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 310); ctx.lineTo(canvas.width, 310); ctx.stroke();
        ctx.fillStyle = "#2a2a2a"; for (let i = 0; i < 10; i++) ctx.fillRect((canvas.width - ((frame * speed * 0.2 + i * 200) % canvas.width)), 50 + i * 30, 2, 2);
        ctx.fillStyle = "#7dd3fc"; ctx.fillRect(char.x, char.y, char.w, char.h);
        ctx.fillStyle = "#000"; ctx.font = "bold 13px monospace"; ctx.fillText("KT", char.x + 8, char.y + 20);
        obstacles.forEach(o => { ctx.fillStyle = "#ff5f57"; ctx.fillRect(o.x, o.y, o.w, o.h); ctx.fillStyle = "#fff"; ctx.font = "10px monospace"; ctx.fillText(o.text, o.x + 3, o.y + o.h / 2 + 3); });
        tokens.forEach(t => { if (t.active) { ctx.fillStyle = "#4ade80"; ctx.beginPath(); ctx.arc(t.x + t.w / 2, t.y + t.h / 2, t.w / 2, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#000"; ctx.font = "10px monospace"; ctx.fillText(t.text, t.x + 4, t.y + 14); } });
    }

    function loop() { update(); draw(); if (currentIsPlaying2) animationId = requestAnimationFrame(loop); }

    function gameOver() {
        currentIsPlaying2 = false;
        msgEl.innerHTML = `FATAL ERROR: Bug encountered <br><span style="color:var(--muted);font-size:.7rem;font-weight:normal;">Score: ${Math.floor(score / 10)}</span>`;
        msgEl.style.color = "#ff5f57"; startBtn.innerText = "Run Debug & Restart"; overlay.classList.remove("hidden");
    }

    function jump() { if (!currentIsPlaying2) return; if (char.jumps < 2) { char.dy = char.jump; char.jumps++; } }
    document.onkeydown = e => { if ((e.code === "Space" || e.code === "ArrowUp") && currentIsPlaying2) { e.preventDefault(); jump(); } };
    canvas.ontouchstart = e => { if (currentIsPlaying2) { e.preventDefault(); jump(); } };
    canvas.onmousedown = e => { if (currentIsPlaying2) { e.preventDefault(); jump(); } };
    startBtn.onclick = reset;
    draw();
}

function initRouter() {
    const canvas = document.getElementById("routerCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("suite-score");
    const startBtn = document.getElementById("router-start");
    const overlay = document.getElementById("router-overlay");
    const msgEl = document.getElementById("router-msg");

    const resize = () => {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth > 0 ? parent.offsetWidth : Math.min(window.innerWidth - 40, 600);
        canvas.height = 360;
    };
    window.addEventListener("resize", resize); resize();

    currentIsPlaying3 = false;
    let uptime = 0; let frame = 0; let speed = 2;
    let animationId;
    let packets = [];
    const methods = ["GET", "POST", "DELETE"];
    const colors = ["#4ade80", "#eab308", "#ff5f57"];
    let servers = [];

    function calcServers() {
        const sw = 80; const gap = 30;
        const totalW = (sw * 3) + (gap * 2);
        const startX = (canvas.width - totalW) / 2;
        servers = methods.map((m, i) => ({ x: startX + (sw + gap) * i, y: 300, w: sw, h: 40, type: m, color: colors[i], active: 0 }));
    }

    function reset() {
        uptime = 0; frame = 0; packets = []; speed = 2;
        calcServers();
        scoreEl.innerText = "Uptime: 0s";
        overlay.classList.add("hidden");
        currentIsPlaying3 = true;
        if (animationId) cancelAnimationFrame(animationId);
        loop();
    }

    function spawn() {
        const rate = Math.max(30, 90 - speed * 8);
        if (frame % Math.floor(rate) === 0) {
            const idx = Math.floor(Math.random() * 3);
            packets.push({ x: Math.random() * (canvas.width - 50) + 25, y: -30, type: methods[idx], color: colors[idx], w: 50, h: 26 });
        }
    }

    function handleClick(cx, cy) {
        if (!currentIsPlaying3) return;
        let clickedServer = null;
        for (let s of servers) {
            if (cx >= s.x && cx <= s.x + s.w && cy >= s.y && cy <= s.y + s.h) { clickedServer = s; break; }
        }
        if (clickedServer) {
            clickedServer.active = 10;
            let lowest = null; let lIdx = -1;
            for (let i = 0; i < packets.length; i++) {
                if (packets[i].type === clickedServer.type) {
                    if (!lowest || packets[i].y > lowest.y) { lowest = packets[i]; lIdx = i; }
                }
            }
            if (lowest) packets.splice(lIdx, 1);
            else speed += 0.5;
        }
    }

    canvas.onmousedown = e => { const r = canvas.getBoundingClientRect(); handleClick(e.clientX - r.left, e.clientY - r.top); };
    canvas.ontouchstart = e => { e.preventDefault(); const r = canvas.getBoundingClientRect(); handleClick(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); };

    function update() {
        if (!currentIsPlaying3) return;
        calcServers();
        for (let i = packets.length - 1; i >= 0; i--) {
            let p = packets[i];
            p.y += speed;
            if (p.y > canvas.height - 40) gameOver();
        }
        servers.forEach(s => { if (s.active > 0) s.active--; });
        if (frame % 60 === 0) { uptime++; scoreEl.innerText = "Uptime: " + uptime + "s"; }
        if (frame % 300 === 0) speed += 0.3;
        spawn(); frame++;
    }

    function draw() {
        ctx.fillStyle = "#0a0a0a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        servers.forEach(s => {
            ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(s.x, s.y, s.w, s.h);
            ctx.strokeStyle = s.active > 0 ? "#fff" : s.color; ctx.lineWidth = s.active > 0 ? 3 : 1.5; ctx.strokeRect(s.x, s.y, s.w, s.h);
            if (s.active > 0) { ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(s.x, s.y, s.w, s.h); }
            ctx.fillStyle = s.active > 0 ? "#fff" : s.color;
            ctx.font = "bold 12px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(s.type, s.x + s.w / 2, s.y + s.h / 2);
        });
        packets.forEach(p => {
            ctx.fillStyle = p.color; ctx.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
            ctx.fillStyle = "#000"; ctx.font = "bold 10px monospace";
            ctx.fillText(p.type, p.x, p.y);
        });
    }

    function loop() { update(); draw(); if (currentIsPlaying3) animationId = requestAnimationFrame(loop); }

    function gameOver() {
        currentIsPlaying3 = false;
        msgEl.innerHTML = `503 SERVICE UNAVAILABLE <br><span style="color:var(--muted);font-size:.7rem;font-weight:normal;">Server crashed after ${uptime}s uptime.</span>`;
        msgEl.style.color = "#c084fc"; startBtn.innerText = "Restart Endpoints"; overlay.classList.remove("hidden");
    }

    startBtn.onclick = reset;
    draw();
}

function initArcadeSnake() {
    const canvas = document.getElementById("arcadeSnakeCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("suite-score");
    const overlay = document.getElementById("snake-overlay");
    const startBtn = document.getElementById("snake-start");
    const msgEl = document.getElementById("snake-msg");
    const tile = 18;
    let snake, food, dir, nextDir, score, timer;

    const resize = () => {
        const parent = canvas.parentElement;
        canvas.width = Math.max(360, parent.offsetWidth || 700);
        canvas.height = 360;
    };
    resize();

    function reset() {
        snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }];
        food = { x: 16, y: 10 };
        dir = { x: 1, y: 0 };
        nextDir = dir;
        score = 0;
        currentIsPlaying4 = true;
        scoreEl.textContent = "Score: 0";
        overlay.classList.add("hidden");
        clearTimeout(timer);
        step();
    }
    function step() {
        if (!currentIsPlaying4 || !canvas.isConnected) return;
        dir = nextDir;
        const cols = Math.floor(canvas.width / tile);
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        const crash = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= 20 || snake.some((p) => p.x === head.x && p.y === head.y);
        if (crash) {
            currentIsPlaying4 = false;
            msgEl.textContent = `Snake crashed. Score ${score}`;
            startBtn.textContent = "Restart Snake";
            overlay.classList.remove("hidden");
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.textContent = `Score: ${score}`;
            food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * 20) };
        } else {
            snake.pop();
        }
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#4ade80";
        snake.forEach((p, i) => {
            ctx.globalAlpha = i ? 0.84 : 1;
            ctx.fillRect(p.x * tile + 1, p.y * tile + 1, tile - 2, tile - 2);
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ff5f57";
        ctx.fillRect(food.x * tile + 1, food.y * tile + 1, tile - 2, tile - 2);
        timer = setTimeout(step, 92);
    }
    document.onkeydown = (event) => {
        if (!currentIsPlaying4) return;
        if (event.key === "ArrowUp" && dir.y === 0) nextDir = { x: 0, y: -1 };
        if (event.key === "ArrowDown" && dir.y === 0) nextDir = { x: 0, y: 1 };
        if (event.key === "ArrowLeft" && dir.x === 0) nextDir = { x: -1, y: 0 };
        if (event.key === "ArrowRight" && dir.x === 0) nextDir = { x: 1, y: 0 };
    };
    startBtn.onclick = reset;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initMemoryGame() {
    const board = document.getElementById("memory-board");
    const overlay = document.getElementById("memory-overlay");
    const startBtn = document.getElementById("memory-start");
    const msgEl = document.getElementById("memory-msg");
    const scoreEl = document.getElementById("suite-score");
    if (!board) return;
    const icons = ["AI", "JS", "SQL", "CSS", "API", "Git"];
    let first = null;
    let lock = false;
    let moves = 0;
    function reset() {
        const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
        board.innerHTML = cards.map((icon) => `<button class="memory-card" data-card="${icon}"><span>?</span></button>`).join("");
        first = null;
        lock = false;
        moves = 0;
        scoreEl.textContent = "Moves: 0";
        overlay.classList.add("hidden");
        board.querySelectorAll(".memory-card").forEach((card) => card.addEventListener("click", () => flip(card)));
    }
    function flip(card) {
        if (lock || card.classList.contains("open") || card.classList.contains("matched")) return;
        card.classList.add("open");
        card.querySelector("span").textContent = card.dataset.card;
        if (!first) {
            first = card;
            return;
        }
        moves++;
        scoreEl.textContent = `Moves: ${moves}`;
        if (first.dataset.card === card.dataset.card) {
            first.classList.add("matched");
            card.classList.add("matched");
            first = null;
            if (!board.querySelector(".memory-card:not(.matched)")) {
                msgEl.textContent = `Cleared in ${moves} moves.`;
                startBtn.textContent = "Play Again";
                overlay.classList.remove("hidden");
            }
            return;
        }
        lock = true;
        setTimeout(() => {
            first.classList.remove("open");
            card.classList.remove("open");
            first.querySelector("span").textContent = "?";
            card.querySelector("span").textContent = "?";
            first = null;
            lock = false;
        }, 620);
    }
    startBtn.onclick = reset;
    reset();
    overlay.classList.remove("hidden");
}

function initPongGame() {
    const canvas = document.getElementById("pongCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("pong-overlay");
    const startBtn = document.getElementById("pong-start");
    const msgEl = document.getElementById("pong-msg");
    const scoreEl = document.getElementById("suite-score");
    let paddleY = 140;
    let ball, score, raf;
    const resize = () => {
        const parent = canvas.parentElement;
        canvas.width = Math.max(360, parent.offsetWidth || 700);
        canvas.height = 360;
    };
    resize();
    function reset() {
        ball = { x: canvas.width / 2, y: 180, vx: 4, vy: 3 };
        score = 0;
        currentIsPlaying6 = true;
        scoreEl.textContent = "Score: 0";
        overlay.classList.add("hidden");
        cancelAnimationFrame(raf);
        loop();
    }
    function aim(clientY) {
        const rect = canvas.getBoundingClientRect();
        paddleY = Math.max(10, Math.min(canvas.height - 90, clientY - rect.top - 40));
    }
    canvas.onmousemove = (event) => aim(event.clientY);
    canvas.ontouchmove = (event) => {
        event.preventDefault();
        aim(event.touches[0].clientY);
    };
    function loop() {
        if (!currentIsPlaying6 || !canvas.isConnected) return;
        ball.x += ball.vx;
        ball.y += ball.vy;
        if (ball.y < 10 || ball.y > canvas.height - 10) ball.vy *= -1;
        if (ball.x > canvas.width - 12) ball.vx *= -1;
        if (ball.x < 28 && ball.y > paddleY && ball.y < paddleY + 80) {
            ball.vx = Math.abs(ball.vx) + 0.25;
            score += 10;
            scoreEl.textContent = `Score: ${score}`;
        }
        if (ball.x < -20) {
            currentIsPlaying6 = false;
            msgEl.textContent = `Packet dropped. Score ${score}`;
            startBtn.textContent = "Restart Pong";
            overlay.classList.remove("hidden");
            return;
        }
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(255,255,255,.15)";
        ctx.setLineDash([8, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#c084fc";
        ctx.fillRect(12, paddleY, 12, 80);
        ctx.fillStyle = "#4ade80";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
        ctx.fill();
        raf = requestAnimationFrame(loop);
    }
    startBtn.onclick = reset;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startNeuralGame(canvas, footer) {
    const ctx = canvas.getContext("2d");
    let angle = 0;
    let score = 0;
    let health = 100;
    const particles = Array.from({ length: 18 }, () => ({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height,
        speed: Math.random() * 1.8 + 1,
        bad: Math.random() > 0.45
    }));
    canvas.onmousemove = (event) => {
        const r = canvas.getBoundingClientRect();
        angle = Math.atan2(event.clientY - r.top - canvas.height / 2, event.clientX - r.left - canvas.width / 2);
    };
    const loop = () => {
        if (!canvas.isConnected) return;
        ctx.fillStyle = "#05070b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(126,231,135,.18)";
        for (let x = 0; x < canvas.width; x += 38) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillStyle = "#7ee787";
        ctx.fillRect(0, -4, 90, 8);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#8bb8ff";
        ctx.fill();
        particles.forEach((p) => {
            p.y += p.speed;
            if (p.y > canvas.height) {
                if (p.bad) health -= 4;
                p.y = -20;
                p.x = Math.random() * canvas.width;
                p.bad = Math.random() > 0.45;
            }
            const hit = Math.hypot(p.x - (cx + Math.cos(angle) * 70), p.y - (cy + Math.sin(angle) * 70)) < 18;
            if (hit) {
                score += p.bad ? 8 : -3;
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
            ctx.fillStyle = p.bad ? "#ff5f57" : "#7ee787";
            ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
        });
        footer.textContent = `Model accuracy: ${Math.max(0, score)}% | Stability: ${Math.max(0, health)}%`;
        if (health > 0 && score < 100) requestAnimationFrame(loop);
        else footer.textContent = score >= 100 ? "Model trained. Nice aim." : "Training crashed. Restart Neural.exe.";
    };
    loop();
}

function startRunnerGame(canvas, footer) {
    const ctx = canvas.getContext("2d");
    const player = { x: 72, y: 250, w: 28, h: 42, vy: 0, jumps: 0 };
    let frame = 0;
    let score = 0;
    let running = true;
    const obstacles = [];
    const jump = () => {
        if (player.jumps < 2) {
            player.vy = -13;
            player.jumps++;
        }
    };
    canvas.onclick = jump;
    document.onkeydown = (event) => {
        if (event.code === "Space" || event.code === "ArrowUp") jump();
    };
    const loop = () => {
        if (!canvas.isConnected || !running) return;
        frame++;
        if (frame % 78 === 0) obstacles.push({ x: canvas.width, y: 272, w: 30, h: 34 });
        player.vy += 0.7;
        player.y += player.vy;
        if (player.y > 250) {
            player.y = 250;
            player.vy = 0;
            player.jumps = 0;
        }
        ctx.fillStyle = "#05070b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#3b4252";
        ctx.beginPath();
        ctx.moveTo(0, 314);
        ctx.lineTo(canvas.width, 314);
        ctx.stroke();
        ctx.fillStyle = "#7ee787";
        ctx.fillRect(player.x, player.y, player.w, player.h);
        ctx.fillStyle = "#ff5f57";
        obstacles.forEach((obs) => {
            obs.x -= 6;
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            if (player.x < obs.x + obs.w && player.x + player.w > obs.x && player.y < obs.y + obs.h && player.y + player.h > obs.y) {
                running = false;
            }
        });
        score++;
        footer.textContent = running ? `Deployment score: ${score}` : `Build failed at score ${score}. Restart Runner.exe.`;
        if (running) requestAnimationFrame(loop);
    };
    loop();
}

function startRouterGame(canvas, footer) {
    const ctx = canvas.getContext("2d");
    const lanes = ["GET", "POST", "PUT"];
    let score = 0;
    let misses = 0;
    const packets = [];
    const laneW = canvas.width / lanes.length;
    canvas.onclick = (event) => {
        const r = canvas.getBoundingClientRect();
        const x = event.clientX - r.left;
        const y = event.clientY - r.top;
        packets.forEach((p) => {
            if (Math.abs(p.x - x) < 24 && Math.abs(p.y - y) < 24) {
                score += Math.floor(p.x / laneW) === p.lane ? 10 : -5;
                p.y = canvas.height + 80;
            }
        });
    };
    const loop = () => {
        if (!canvas.isConnected || misses >= 5) return;
        if (Math.random() > 0.94) packets.push({ x: Math.random() * canvas.width, y: -20, lane: Math.floor(Math.random() * 3) });
        ctx.fillStyle = "#05070b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lanes.forEach((lane, i) => {
            ctx.strokeStyle = "rgba(255,255,255,.14)";
            ctx.strokeRect(i * laneW, 0, laneW, canvas.height);
            ctx.fillStyle = "#8bb8ff";
            ctx.fillText(lane, i * laneW + 18, 28);
        });
        packets.forEach((p) => {
            p.y += 2.5;
            if (p.y > canvas.height) {
                misses++;
                p.y = canvas.height + 80;
            }
            ctx.fillStyle = ["#7ee787", "#ff99c8", "#f7bd7f"][p.lane];
            ctx.beginPath();
            ctx.arc(p.x, p.y, 13, 0, Math.PI * 2);
            ctx.fill();
        });
        footer.textContent = `Routed: ${score} | Dropped: ${misses}/5`;
        requestAnimationFrame(loop);
    };
    loop();
}

document.addEventListener("DOMContentLoaded", () => {
    initBoot();
    initClock();
    initMenus();
    initDesktop();
    initSpotlight();
    initWallpaper();
    initHeatmap();
    initKeyboard();
    initMusic();
});
