/* ============================================================================
   home.js — portada: contadores de módulos + destacados
   ========================================================================== */
(function () {
  "use strict";
  var B = window.Blog, S = B.SECTIONS;

  Promise.all(B.ORDER.map(function (k) {
    return B.fetchJSON(S[k].file)
      .then(function (d) { return (d || []).map(function (e) { e._type = k; return e; }); })
      .catch(function () { return []; });
  })).then(function (groups) {
    // contadores de módulos
    B.ORDER.forEach(function (k, i) {
      var el = document.querySelector('[data-count="' + k + '"]');
      if (el) el.textContent = groups[i].length + " posts";
    });
    // destacados
    var mount = document.getElementById("latest");
    if (!mount) return;
    var all = [].concat.apply([], groups).sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); }).slice(0, 6);
    if (!all.length) { var sec = mount.closest(".latest-section"); if (sec) sec.style.display = "none"; return; }
    mount.innerHTML = all.map(function (e) {
      var cfg = S[e._type];
      var href = "post.html?type=" + encodeURIComponent(e._type) + "&slug=" + encodeURIComponent(e.slug);
      var badges = '<span class="kind kind--' + cfg.cls + '">' + B.icon(cfg.icon) + B.esc(cfg.kind) + "</span>";
      if (e.level) badges += '<span class="badge badge--level ' + B.levelClass(e.level) + '">' + B.esc(e.level) + "</span>";
      var tags = (e.tags || []).slice(0, 3).map(function (t) { return '<span class="tag" data-hue="' + B.hueOf(t) + '">#' + B.esc(t) + "</span>"; }).join("");
      return '<a class="card reveal kind--' + cfg.cls + '" style="--k:var(--t-' + cfg.cls + ')" href="' + href + '">' +
        '<div class="card__badges">' + badges + "</div>" +
        '<h3 class="card__title">' + B.esc(e.title) + "</h3>" +
        '<p class="card__summary">' + B.esc(e.summary || "") + "</p>" +
        '<div class="card__foot"><div class="card__tags">' + tags + "</div>" +
        '<span class="card__date">' + B.fmtDate(e.date) + "</span></div></a>";
    }).join("");
    B.observeReveals();
  });
})();
