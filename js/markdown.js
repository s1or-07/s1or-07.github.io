/* ============================================================================
   markdown.js  —  Renderizador de Markdown propio (sin dependencias)
   ----------------------------------------------------------------------------
   Soporta lo que se usa en notas de Obsidian:
     - Encabezados, listas (ordenadas/no), citas, reglas (___ / --- / ***)
     - Bloques de código con lenguaje y resaltado conservador
     - Código indentado (tabulación / 4 espacios) -> bloque de comandos
     - Negrita **x**, cursiva *x*, tachado ~~x~~, código en línea `x`
     - Enlaces [t](u), autolinks, imágenes ![alt](u)
     - Imágenes estilo Obsidian:  ![[archivo.png]]  y  ![[archivo.png|alt]]
     - Callouts:  > [!NOTE] Titulo  (NOTE/TIP/WARNING/INFO/EXAMPLE/DANGER...)
                  con cuerpo, código y callouts anidados
     - Tablas GitHub básicas
   Expone:  window.MD.render(md, { imageBase })  ->  string HTML
   ========================================================================== */
(function (root) {
  "use strict";

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function slugify(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "sec";
  }

  /* ---------- resaltado de código (conservador y seguro) ---------- */
  var KEYWORDS = {
    python: new Set("def class return import from for in if elif else while try except finally with as lambda None True False and or not is pass break continue global nonlocal yield raise assert del print open self".split(" ")),
    bash: new Set("if then else elif fi for in do done while until case esac function return echo export local sudo cd ls cat grep awk sed find chmod chown nc ncat curl wget bash sh python python3 zip make".split(" ")),
    powershell: new Set("if else elseif foreach for while function return param begin process end try catch finally".split(" "))
  };
  var ALIAS = { sh: "bash", shell: "bash", zsh: "bash", console: "bash", ps: "powershell", ps1: "powershell", py: "python" };

  function tokenRegex(lang) {
    // grupos: 1 string · 2 comment · 3 flag · 4 cmdlet(ps) · 5 number · 6 word
    var str = "(\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`(?:\\\\.|[^`\\\\])*`)";
    var comment = "(#[^\\n]*|//[^\\n]*)";
    var flag = "((?<=^|\\s)--?[A-Za-z][\\w-]*)";
    var cmdlet = lang === "powershell" ? "(\\b[A-Z][a-z]+-[A-Z][A-Za-z]+\\b)" : "()";
    var num = "(\\b\\d[\\d_.]*\\b)";
    var word = "([A-Za-z_]\\w*)";
    return new RegExp([str, comment, flag, cmdlet, num, word].join("|"), "g");
  }

  function highlight(code, lang) {
    lang = (lang || "").toLowerCase();
    lang = ALIAS[lang] || lang;
    var kw = KEYWORDS[lang];
    if (!kw && lang !== "powershell") return esc(code);
    var re = tokenRegex(lang), out = "", last = 0, m;
    while ((m = re.exec(code))) {
      if (m.index > last) out += esc(code.slice(last, m.index));
      if (m[1]) out += '<span class="tok-str">' + esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="tok-com">' + esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="tok-flag">' + esc(m[3]) + "</span>";
      else if (m[4]) out += '<span class="tok-kw">' + esc(m[4]) + "</span>";
      else if (m[5]) out += '<span class="tok-num">' + esc(m[5]) + "</span>";
      else if (m[6]) {
        out += kw && kw.has(m[6])
          ? '<span class="tok-kw">' + esc(m[6]) + "</span>"
          : esc(m[6]);
      }
      last = re.lastIndex;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    out += esc(code.slice(last));
    return out;
  }

  /* ---------- procesamiento en línea ---------- */
  function inline(text, ctx) {
    // 1) proteger código en línea
    var codes = [];
    text = text.replace(/`([^`]+)`/g, function (_, c) {
      codes.push('<code class="inline-code">' + esc(c) + "</code>");
      return "\u0000C" + (codes.length - 1) + "\u0000";
    });
    // 2) escapar el resto
    text = esc(text);
    // 3) imágenes Obsidian  ![[archivo|alt]]
    text = text.replace(/!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, function (_, file, alt) {
      var src = ctx.imageBase + encodeURIComponent(file.trim()).replace(/%2F/g, "/");
      return imgTag(src, (alt || file).trim(), file.trim());
    });
    // 4) imágenes normales ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, function (_, alt, url) {
      return imgTag(url, alt, alt);
    });
    // 5) enlaces [t](u)
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, function (_, t, u) {
      var ext = /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + u + '"' + ext + ">" + t + "</a>";
    });
    // 6) autolinks
    text = text.replace(/(^|[\s(])((?:https?:\/\/)[^\s<)]+)/g, function (_, p, u) {
      return p + '<a href="' + u + '" target="_blank" rel="noopener">' + u + "</a>";
    });
    // 7) énfasis
    text = text.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__([^_]+?)__/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?![*\w])/g, "$1<em>$2</em>");
    text = text.replace(/(^|[^_\w])_(?!\s)([^_]+?)(?<!\s)_(?![_\w])/g, "$1<em>$2</em>");
    text = text.replace(/~~([^~]+?)~~/g, "<del>$1</del>");
    // 8) restaurar código
    text = text.replace(/\u0000C(\d+)\u0000/g, function (_, i) { return codes[+i]; });
    return text;
  }

  function imgTag(src, alt, file) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" ' +
      'data-file="' + esc(file) + '" onerror="MD.imgFallback(this)">';
  }

  /* ---------- línea -> tipo ---------- */
  var RE = {
    fence: /^(`{3,}|~{3,})\s*([\w+-]*)\s*$/,
    heading: /^(#{1,6})\s+(.*?)\s*#*\s*$/,
    hr: /^[ \t]*([-*_])(?:[ \t]*\1){2,}[ \t]*$/,
    ulitem: /^[ \t]*[-*+]\s+(.*)$/,
    olitem: /^[ \t]*\d+[.)]\s+(.*)$/,
    quote: /^>\s?(.*)$/,
    indent: /^(\t| {4})(.*)$/,
    tableRow: /^\s*\|(.+)\|\s*$/,
    tableSep: /^\s*\|?[\s:|-]+\|?\s*$/
  };

  function stripQuote(line) {
    if (line.indexOf("> ") === 0) return line.slice(2);
    if (line === ">") return "";
    if (line[0] === ">") return line.slice(1);
    return line;
  }

  /* ---------- parser de bloques ---------- */
  function parse(src, ctx) {
    var lines = src.replace(/\r\n?/g, "\n").split("\n");
    var html = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      // línea vacía
      if (/^\s*$/.test(line)) { i++; continue; }

      // bloque de código cercado
      var fm = line.match(RE.fence);
      if (fm) {
        var fence = fm[1][0], lang = fm[2] || "", buf = [];
        i++;
        while (i < lines.length && !(lines[i].match(RE.fence) && lines[i].trim()[0] === fence)) {
          buf.push(lines[i]); i++;
        }
        i++; // saltar cierre
        html.push(codeBlock(buf.join("\n"), lang));
        continue;
      }

      // cita / callout
      if (RE.quote.test(line)) {
        var qbuf = [];
        while (i < lines.length && (RE.quote.test(lines[i]) || lines[i] === ">")) {
          qbuf.push(stripQuote(lines[i])); i++;
        }
        html.push(renderQuote(qbuf, ctx));
        continue;
      }

      // encabezado
      var hm = line.match(RE.heading);
      if (hm) {
        var lvl = hm[1].length;
        var txt = hm[2];
        var id = uniqueId(slugify(txt), ctx);
        html.push("<h" + lvl + ' id="' + id + '">' + inline(txt, ctx) + "</h" + lvl + ">");
        i++; continue;
      }

      // regla horizontal
      if (RE.hr.test(line)) { html.push('<hr class="rule">'); i++; continue; }

      // tabla
      if (RE.tableRow.test(line) && i + 1 < lines.length && RE.tableSep.test(lines[i + 1])) {
        var tb = [];
        while (i < lines.length && RE.tableRow.test(lines[i])) { tb.push(lines[i]); i++; }
        html.push(renderTable(tb, ctx));
        continue;
      }

      // lista
      if (RE.ulitem ? (RE.ulitem.test(line) || RE.olitem.test(line)) : false) {
        var lbuf = [];
        while (i < lines.length && (RE.ulitem.test(lines[i]) || RE.olitem.test(lines[i]) ||
               (/^\s+\S/.test(lines[i]) && !/^\s*$/.test(lines[i])))) {
          if (/^\s*$/.test(lines[i])) break;
          lbuf.push(lines[i]); i++;
        }
        html.push(renderList(lbuf, ctx));
        continue;
      }

      // código indentado (comandos)
      if (RE.indent.test(line)) {
        var ibuf = [];
        while (i < lines.length && (RE.indent.test(lines[i]) || /^\s*$/.test(lines[i]))) {
          if (/^\s*$/.test(lines[i])) {
            // permitir una línea en blanco solo si sigue más código
            if (i + 1 < lines.length && RE.indent.test(lines[i + 1])) { ibuf.push(""); i++; continue; }
            break;
          }
          ibuf.push(lines[i].replace(RE.indent, "$2")); i++;
        }
        html.push(codeBlock(ibuf.join("\n").replace(/\n+$/, ""), ""));
        continue;
      }

      // párrafo
      var pbuf = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) &&
             !RE.fence.test(lines[i]) && !RE.quote.test(lines[i]) &&
             !RE.heading.test(lines[i]) && !RE.hr.test(lines[i]) &&
             !RE.ulitem.test(lines[i]) && !RE.olitem.test(lines[i]) &&
             !RE.indent.test(lines[i])) {
        pbuf.push(lines[i]); i++;
      }
      html.push("<p>" + inline(pbuf.join(" ").trim(), ctx) + "</p>");
    }

    return html.join("\n");
  }

  /* ---------- bloque de código ---------- */
  function codeBlock(code, lang) {
    var label = (lang || "code").toLowerCase();
    return '<div class="codeblock" data-lang="' + esc(label) + '">' +
      '<div class="codeblock__bar"><span class="codeblock__dots"><i></i><i></i><i></i></span>' +
      '<span class="codeblock__lang">' + esc(label) + "</span>" +
      '<button class="codeblock__copy" type="button" aria-label="Copiar código">copiar</button></div>' +
      "<pre><code>" + highlight(code, lang) + "</code></pre></div>";
  }

  /* ---------- callouts y citas ---------- */
  var CALLOUTS = {
    note: { cls: "note", icon: "✎", label: "Nota" },
    info: { cls: "info", icon: "ℹ", label: "Info" },
    tip: { cls: "tip", icon: "★", label: "Tip" },
    hint: { cls: "tip", icon: "★", label: "Tip" },
    success: { cls: "success", icon: "✔", label: "Éxito" },
    example: { cls: "example", icon: "❯", label: "Ejemplo" },
    question: { cls: "question", icon: "?", label: "Pregunta" },
    warning: { cls: "warning", icon: "▲", label: "Advertencia" },
    caution: { cls: "warning", icon: "▲", label: "Cuidado" },
    attention: { cls: "warning", icon: "▲", label: "Atención" },
    danger: { cls: "danger", icon: "⚠", label: "Peligro" },
    error: { cls: "danger", icon: "⚠", label: "Error" },
    bug: { cls: "danger", icon: "⚠", label: "Bug" },
    abstract: { cls: "info", icon: "≡", label: "Resumen" },
    summary: { cls: "info", icon: "≡", label: "Resumen" },
    quote: { cls: "quote", icon: "❝", label: "Cita" }
  };

  function renderQuote(innerLines, ctx) {
    var first = innerLines[0] || "";
    var cm = first.match(/^\[!(\w+)\]([+-]?)\s*(.*)$/);
    if (cm) {
      var type = cm[1].toLowerCase();
      var meta = CALLOUTS[type] || { cls: "note", icon: "✎", label: cm[1] };
      var title = cm[3].trim() || meta.label;
      var bodyLines = innerLines.slice(1);
      var body = bodyLines.join("\n").trim() ? parse(bodyLines.join("\n"), ctx) : "";
      return '<div class="callout callout--' + meta.cls + '">' +
        '<div class="callout__title"><span class="callout__icon" aria-hidden="true">' + meta.icon + "</span>" +
        "<span>" + inline(title, ctx) + "</span></div>" +
        (body ? '<div class="callout__body">' + body + "</div>" : "") +
        "</div>";
    }
    return '<blockquote class="quote">' + parse(innerLines.join("\n"), ctx) + "</blockquote>";
  }

  /* ---------- listas (con un nivel de anidado) ---------- */
  function renderList(buf, ctx) {
    var ordered = RE.olitem.test(buf[0]);
    var tag = ordered ? "ol" : "ul";
    var items = [];
    var cur = null;
    var subBuf = null;

    function flushSub() {
      if (subBuf && subBuf.length && cur != null) {
        items[cur] += renderList(subBuf.map(function (s) { return s.replace(/^(\t| {2,4})/, ""); }), ctx);
      }
      subBuf = null;
    }

    for (var k = 0; k < buf.length; k++) {
      var ln = buf[k];
      var um = ln.match(RE.ulitem), om = ln.match(RE.olitem);
      var indented = /^(\t| {2,})/.test(ln);
      if ((um || om) && !indented) {
        flushSub();
        items.push("<li>" + inline((um ? um[1] : om[1]), ctx));
        cur = items.length - 1;
        items[cur] += "</li>";
        // reinsertar contenido para permitir sub-items: gestionamos abajo
      } else if (indented && (RE.ulitem.test(ln) || RE.olitem.test(ln))) {
        subBuf = subBuf || [];
        subBuf.push(ln);
      } else {
        // continuación de texto del item
        if (cur != null) {
          items[cur] = items[cur].replace(/<\/li>$/, " " + inline(ln.trim(), ctx) + "</li>");
        }
      }
    }
    flushSub();
    return "<" + tag + ' class="md-list">' + items.join("") + "</" + tag + ">";
  }

  /* ---------- tablas ---------- */
  function renderTable(rows, ctx) {
    function cells(r) {
      return r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(function (c) { return c.trim(); });
    }
    var head = cells(rows[0]);
    var body = rows.slice(2).map(cells);
    var h = "<thead><tr>" + head.map(function (c) { return "<th>" + inline(c, ctx) + "</th>"; }).join("") + "</tr></thead>";
    var b = "<tbody>" + body.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + inline(c, ctx) + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    return '<div class="table-wrap"><table class="md-table">' + h + b + "</table></div>";
  }

  /* ---------- ids únicos ---------- */
  function uniqueId(base, ctx) {
    ctx.ids = ctx.ids || {};
    if (ctx.ids[base] == null) { ctx.ids[base] = 0; return base; }
    ctx.ids[base]++;
    return base + "-" + ctx.ids[base];
  }

  /* ---------- API pública ---------- */
  function stripFrontmatter(src) {
    var m = src.match(/^---\n[\s\S]*?\n---\n?/);
    return m ? src.slice(m[0].length) : src;
  }

  var MD = {
    render: function (md, opts) {
      opts = opts || {};
      var ctx = { imageBase: opts.imageBase || "", ids: {} };
      return parse(stripFrontmatter(md), ctx);
    },
    highlight: highlight,
    imgFallback: function (img) {
      var f = img.getAttribute("data-file") || "imagen";
      var ph = document.createElement("div");
      ph.className = "img-pending";
      ph.innerHTML = '<span class="img-pending__icon">🖼</span>' +
        '<span class="img-pending__name">' + esc(f) + "</span>" +
        '<span class="img-pending__hint">imagen pendiente — súbela a la carpeta <code>img/</code> de esta entrada</span>';
      img.replaceWith(ph);
    }
  };

  root.MD = MD;
  if (typeof module !== "undefined" && module.exports) module.exports = MD;
})(typeof window !== "undefined" ? window : globalThis);
