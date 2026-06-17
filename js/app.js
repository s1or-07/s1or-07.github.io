/* ============================================================================
   app.js — utilidades compartidas + configuración de secciones
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- configuración central de secciones ---------- */
  var ICONS = {
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4M4 4h13l-2.5 4 2.5 4H4"/></svg>',
    diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 9-9 9-9-9z"/></svg>',
    hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
  };
  var SECTIONS = {
    writeups: { type: "writeups", kind: "WriteUp", plural: "WriteUps", label: "writeups", path: "~/writeups", cmd: "./pwn", cls: "writeups", icon: "flag", file: "content/writeups/writeups.json", base: "content/writeups/", desc: "Resolución de máquinas (HTB, THM) fase a fase: recon, enumeración, explotación y post-explotación." },
    guides:   { type: "guides", kind: "Guía", plural: "Guías", label: "guías", path: "~/guias", cmd: "./learn", cls: "guides", icon: "diamond", file: "content/guides/guides.json", base: "content/guides/", desc: "Investigaciones y guías paso a paso: técnicas, configuraciones y código comentado línea a línea." },
    tools:    { type: "tools", kind: "Herramienta", plural: "Herramientas", label: "herramientas", path: "~/herramientas", cmd: "./run", cls: "tools", icon: "hash", file: "content/tools/tools.json", base: "content/tools/", desc: "Scripts y utilidades propias con descripción, modo de uso y código fuente." }
  };
  var ORDER = ["writeups", "guides", "tools"];

  /* ---------- tema claro / oscuro ---------- */
  var root = document.documentElement;
  function setTheme(t) { root.setAttribute("data-theme", t); try { localStorage.setItem("blog-theme", t); } catch (e) {} }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-theme-toggle]")) setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- navegación móvil ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-nav-toggle]")) { document.querySelector(".nav").classList.toggle("open"); return; }
    if (!e.target.closest(".nav") && !e.target.closest("[data-nav-toggle]")) {
      var nav = document.querySelector(".nav.open"); if (nav) nav.classList.remove("open");
    }
  });

  /* ---------- enlace de navegación activo + año ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) { var l = document.querySelector('.nav a[data-page="' + page + '"]'); if (l) l.classList.add("is-active"); }
  document.querySelectorAll("#year").forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* ---------- copiar código (delegado) ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".codeblock__copy"); if (!btn) return;
    var code = btn.closest(".codeblock").querySelector("code");
    var text = code ? code.innerText : "";
    var done = function () { btn.classList.add("copied"); btn.innerHTML = ICONS.copy + "copiado"; setTimeout(function () { btn.classList.remove("copied"); btn.innerHTML = ICONS.copy + "copiar"; }, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fb); else fb();
    function fb() { var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (x) {} document.body.removeChild(ta); }
  });

  /* ---------- revelado al hacer scroll ---------- */
  function observeReveals() {
    var reveals = document.querySelectorAll(".reveal:not(.in)");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .12 });
      reveals.forEach(function (el) { io.observe(el); });
    } else { reveals.forEach(function (el) { el.classList.add("in"); }); }
  }
  observeReveals();

  /* ---------- animación de terminal (portada) ---------- */
  function initTerminal() {
    var body = document.getElementById("term-body"); if (!body) return;
    var seq = [
      { cmd: "whoami", out: '<span class="out">s1or — offensive security · research</span>' },
      { cmd: "ls ~/posts", out: '<span class="dir">writeups/</span>  <span class="dir">guias/</span>  <span class="dir">herramientas/</span>' },
      { cmd: "./engage --target box.htb", out: '<span class="ok">[+] shell obtenida. happy hacking.</span>' }
    ];
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      body.innerHTML = seq.map(function (s) { return '<div class="ln"><span class="prompt">$ </span><span class="cmd">' + s.cmd + '</span></div><div class="ln">' + s.out + '</div>'; }).join("") + '<div class="ln"><span class="prompt">$ </span><span class="term-cursor"></span></div>';
      return;
    }
    var i = 0;
    function step() {
      if (i >= seq.length) { var f = document.createElement("div"); f.className = "ln"; f.innerHTML = '<span class="prompt">$ </span><span class="term-cursor"></span>'; body.appendChild(f); return; }
      var s = seq[i];
      var line = document.createElement("div"); line.className = "ln";
      line.innerHTML = '<span class="prompt">$ </span><span class="cmd"></span>';
      body.appendChild(line);
      var span = line.querySelector(".cmd"), j = 0;
      (function type() {
        if (j <= s.cmd.length) { span.textContent = s.cmd.slice(0, j); j++; setTimeout(type, 34); }
        else { var o = document.createElement("div"); o.className = "ln"; o.innerHTML = s.out; o.style.opacity = 0; body.appendChild(o); requestAnimationFrame(function () { o.style.transition = "opacity .3s"; o.style.opacity = 1; }); i++; setTimeout(step, 520); }
      })();
    }
    setTimeout(step, 450);
  }
  initTerminal();

  /* ---------- helpers globales ---------- */
  window.Blog = {
    SECTIONS: SECTIONS, ORDER: ORDER, ICONS: ICONS,
    icon: function (name) { return ICONS[name] || ""; },
    levelClass: function (lv) { var v = (lv || "").toLowerCase(); if (v.indexOf("med") === 0 || v.indexOf("med") > -1) return "lvl-medium"; if (v.indexOf("har") > -1 || v.indexOf("dif") > -1 || v.indexOf("insa") > -1) return "lvl-hard"; return ""; },
    hueOf: function (tag) { var s = 0; for (var i = 0; i < tag.length; i++) s = (s + tag.charCodeAt(i)) % 6; return s; },
    fetchJSON: function (u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); },
    fetchText: function (u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }); },
    fmtDate: function (iso) { if (!iso) return ""; var p = iso.split("-"); if (p.length < 3) return iso; var m = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]; return p[2] + " " + m[(+p[1]) - 1] + " " + p[0]; },
    esc: function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); },
    observeReveals: observeReveals
  };
})();
