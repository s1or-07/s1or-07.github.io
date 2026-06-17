/* ============================================================================
   listing.js — listado de una sección (cards horizontales, tabs, filtros)
   HTML requerido:
     <div data-section-tabs></div>
     <div class="filterbar"><span class="filterbar__label">filtrar:</span><div data-tagfilter></div></div>
     <p class="result-count" data-result-count></p>
     <div id="listing" class="cards" data-type="writeups"></div>
   Búsqueda: input.header-search[data-search]
   ========================================================================== */
(function () {
  "use strict";
  var mount = document.getElementById("listing");
  if (!mount) return;

  var B = window.Blog, S = B.SECTIONS, type = mount.dataset.type, cfg = S[type];
  var tabsEl = document.querySelector("[data-section-tabs]");
  var tagWrap = document.querySelector("[data-tagfilter]");
  var countEl = document.querySelector("[data-result-count]");
  var searchEl = document.querySelector("[data-search]");

  var entries = [], activeTags = new Set(), query = "";

  // contar todas las secciones para las pestañas
  Promise.all(B.ORDER.map(function (k) {
    return B.fetchJSON(S[k].file).then(function (d) { return d || []; }).catch(function () { return []; });
  })).then(function (groups) {
    var counts = {};
    B.ORDER.forEach(function (k, idx) { counts[k] = groups[idx].length; });
    renderTabs(counts);
    entries = (groups[B.ORDER.indexOf(type)] || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    buildTagFilter();
    render();
  }).catch(function () { mount.innerHTML = '<div class="empty">No se pudo cargar el listado.</div>'; });

  function renderTabs(counts) {
    if (!tabsEl) return;
    tabsEl.innerHTML = B.ORDER.map(function (k) {
      return '<a href="' + k + '.html"' + (k === type ? ' class="is-active"' : "") + ">" + B.esc(S[k].plural) + ' <span class="n">' + (counts[k] || 0) + "</span></a>";
    }).join("");
  }

  function buildTagFilter() {
    if (!tagWrap) return;
    var all = {};
    entries.forEach(function (e) { (e.tags || []).forEach(function (t) { all[t] = 1; }); });
    var tags = Object.keys(all).sort();
    tagWrap.innerHTML = tags.map(function (t) {
      return '<button class="tag" type="button" data-hue="' + B.hueOf(t) + '" data-tag="' + B.esc(t) + '">#' + B.esc(t) + "</button>";
    }).join("");
    tagWrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-tag]"); if (!b) return;
      var t = b.dataset.tag;
      if (activeTags.has(t)) { activeTags.delete(t); b.classList.remove("is-on"); }
      else { activeTags.add(t); b.classList.add("is-on"); }
      render();
    });
  }

  if (searchEl) searchEl.addEventListener("input", function () { query = this.value.trim().toLowerCase(); render(); });

  function matches(e) {
    if (activeTags.size && !(e.tags || []).some(function (t) { return activeTags.has(t); })) return false;
    if (query) { var h = (e.title + " " + (e.summary || "") + " " + (e.tags || []).join(" ")).toLowerCase(); if (h.indexOf(query) === -1) return false; }
    return true;
  }

  function card(e) {
    var href = "post.html?type=" + encodeURIComponent(type) + "&slug=" + encodeURIComponent(e.slug);
    var badges = '<span class="kind kind--' + cfg.cls + '">' + B.icon(cfg.icon) + B.esc(cfg.kind) + "</span>";
    if (e.level) badges += '<span class="badge badge--level ' + B.levelClass(e.level) + '">' + B.esc(e.level) + "</span>";
    if (e.source) badges += '<span class="badge">' + B.esc(e.source) + "</span>";
    var tags = (e.tags || []).slice(0, 6).map(function (t) { return '<span class="tag" data-hue="' + B.hueOf(t) + '">#' + B.esc(t) + "</span>"; }).join("");
    return '<a class="card reveal kind--' + cfg.cls + '" style="--k:var(--t-' + cfg.cls + ')" href="' + href + '">' +
      '<div class="card__icon"><span class="icon-sq icon-sq--' + cfg.cls + '">' + B.icon(cfg.icon) + "</span></div>" +
      '<div class="card__body">' +
        '<div class="card__badges">' + badges + "</div>" +
        '<h2 class="card__title">' + B.esc(e.title) + "</h2>" +
        '<p class="card__summary">' + B.esc(e.summary || "") + "</p>" +
        '<div class="card__foot"><div class="card__tags">' + tags + "</div>" +
        '<span class="card__date">' + B.fmtDate(e.date) + "</span></div>" +
      "</div></a>";
  }

  function render() {
    var list = entries.filter(matches);
    if (countEl) countEl.textContent = "# " + list.length + (list.length === 1 ? " resultado" : " resultados");
    mount.innerHTML = list.length ? list.map(card).join("") : '<div class="empty">Sin resultados. Ajusta la búsqueda o los filtros.</div>';
    B.observeReveals();
  }
})();
