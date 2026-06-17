/* ============================================================================
   post.js — entrada individual (back-btn, badges, lead, intro, TOC)
   URL: post.html?type=writeups&slug=twomillion
   ========================================================================== */
(function () {
  "use strict";
  var B = window.Blog, S = B.SECTIONS;
  var params = new URLSearchParams(location.search);
  var type = params.get("type"), slug = params.get("slug"), cfg = S[type];

  var headEl = document.getElementById("post-head");
  var bodyEl = document.getElementById("post-content");
  var tocEl = document.getElementById("toc-list");
  var tocMobileEl = document.getElementById("toc-mobile-list");

  if (!cfg || !slug) { fail("Entrada no especificada correctamente."); return; }

  B.fetchJSON(cfg.file).then(function (list) {
    var meta = (list || []).filter(function (e) { return e.slug === slug; })[0];
    if (!meta) throw new Error("404");
    renderHead(meta);
    document.title = meta.title + " · s1or";
    var base = cfg.base + slug + "/";
    return B.fetchText(base + "index.md").then(function (md) {
      bodyEl.innerHTML = MD.render(md, { imageBase: base + "img/" });
      buildTOC();
    });
  }).catch(function () { fail("No se encontró esta entrada. Vuelve al listado de " + (cfg ? cfg.plural : "entradas") + "."); });

  function renderHead(meta) {
    var badges = '<span class="kind kind--' + cfg.cls + '">' + B.icon(cfg.icon) + B.esc(cfg.kind) + "</span>";
    if (meta.level) badges += '<span class="badge badge--level ' + B.levelClass(meta.level) + '">' + B.esc(meta.level) + "</span>";
    if (meta.source) badges += '<span class="badge">' + B.esc(meta.source) + "</span>";
    badges += '<span class="badge badge--date">' + B.fmtDate(meta.date) + "</span>";
    var tags = (meta.tags || []).map(function (t) { return '<span class="tag" data-hue="' + B.hueOf(t) + '">#' + B.esc(t) + "</span>"; }).join("");
    var intro = meta.meta ? '<div class="post-head__intro">' + MD.render(meta.meta, { imageBase: "" }) + "</div>" : "";
    headEl.innerHTML =
      '<a class="back-btn" href="' + type + '.html"><span class="arrow">' + B.icon("back") + '</span><span class="back-btn__kw">cd</span> <span class="back-btn__pth">../' + type + "</span></a>" +
      '<div class="post-head__badges">' + badges + "</div>" +
      "<h1>" + B.esc(meta.title) + "</h1>" +
      (meta.summary ? '<p class="post-head__lead">' + B.esc(meta.summary) + "</p>" : "") +
      '<div class="post-head__tags">' + tags + "</div>" + intro;
  }

  function buildTOC() {
    var heads = bodyEl.querySelectorAll("h1, h2, h3");
    if (!heads.length) { document.querySelectorAll(".toc, .toc-mobile").forEach(function (n) { n.style.display = "none"; }); return; }
    var html = "";
    heads.forEach(function (h) {
      if (!h.id) h.id = "h-" + Math.random().toString(36).slice(2, 8);
      var lvl = h.tagName === "H3" ? 3 : 2;
      html += '<li><a class="lvl-' + lvl + '" href="#' + h.id + '">' + B.esc(h.textContent) + "</a></li>";
    });
    if (tocEl) tocEl.innerHTML = html;
    if (tocMobileEl) tocMobileEl.innerHTML = html;
    var links = Array.prototype.slice.call(document.querySelectorAll('#toc-list a, #toc-mobile-list a'));
    function setActive(id) { links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); }); }
    document.querySelectorAll(".toc, .toc-mobile").forEach(function (rootEl) {
      rootEl.addEventListener("click", function (e) {
        var a = e.target.closest("a"); if (!a) return; e.preventDefault();
        var id = a.getAttribute("href").slice(1);
        var el = document.getElementById(id);
        if (el) { setActive(id); el.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", "#" + id); }
      });
    });
    function spy() {
      var cur = heads[0].id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        cur = heads[heads.length - 1].id;            // al final de la página, activa el último ítem
      } else {
        heads.forEach(function (h) { if (h.getBoundingClientRect().top - 130 <= 0) cur = h.id; });
      }
      setActive(cur);
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(function () { spy(); ticking = false; }); ticking = true; }
    }, { passive: true });
    spy();
  }

  function fail(msg) {
    if (headEl) headEl.innerHTML = '<a class="back-btn" href="index.html"><span class="arrow">' + B.icon("back") + '</span><span class="back-btn__kw">cd</span> <span class="back-btn__pth">~</span></a>';
    if (bodyEl) bodyEl.innerHTML = '<div class="empty">' + B.esc(msg) + '</div>';
    document.querySelectorAll(".toc, .toc-mobile").forEach(function (n) { n.style.display = "none"; });
  }
})();
