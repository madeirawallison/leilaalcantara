/* Leila Alcântara Fotografia — interações do site */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var pad = function (n) { return String(n).padStart(2, "0"); };

  function store(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  // ---------- Origem do visitante (anúncio x site) ----------
  var origem = (function () {
    var p = new URLSearchParams(location.search);
    if (p.get("fbclid") || p.get("gclid") || p.get("utm_source") || p.get("utm_medium") === "paid") {
      store("la_origem", "anuncio");
    }
    return store("la_origem") || "site";
  })();
  var baseMsg = (C.mensagens && C.mensagens[origem]) || "Oi Leila! Quero saber os horários do Ensaio de Natal";

  // ---------- Meta Pixel (só carrega se houver ID) ----------
  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", C.metaPixelId);
    window.fbq("track", "PageView");
  }
  function track(evt, data) {
    if (window.fbq) window.fbq("track", evt, data || {});
    if (window.gtag) window.gtag("event", evt, data || {});
  }

  // ---------- Links de WhatsApp / Instagram ----------
  function waUrl(msg) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg); }
  var igUrl = "https://www.instagram.com/" + C.instagram + "/";

  $$(".js-ig").forEach(function (a) { a.href = igUrl; a.target = "_blank"; a.rel = "noopener"; });
  $$(".js-wa").forEach(function (a) {
    var msg = a.getAttribute("data-msg") || baseMsg;
    if (a.hasAttribute("data-msg") && origem === "anuncio") msg += " (vi o anúncio)";
    a.href = waUrl(msg);
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", function () {
      track("Contact", { content_name: a.getAttribute("data-origem") || "whatsapp" });
    });
  });

  // ---------- Lotes / urgência ----------
  function parseDay(s, endOfDay) {
    var p = s.split("-").map(Number);
    return endOfDay ? new Date(p[0], p[1] - 1, p[2], 23, 59, 59) : new Date(p[0], p[1] - 1, p[2], 0, 0, 0);
  }
  function fmtDM(s) { var p = s.split("-"); return p[2] + "/" + p[1]; }
  function money(v) { return "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 }); }

  var lotes = (C.lotes || []).map(function (l) {
    return Object.assign({}, l, { ini: l.de ? parseDay(l.de) : null, fim: parseDay(l.ate, true) });
  });
  function loteAtual(now) {
    for (var i = 0; i < lotes.length; i++) {
      if (now <= lotes[i].fim && (!lotes[i].ini || now >= lotes[i].ini)) return lotes[i];
    }
    return null;
  }
  function loteDoDia(d) {
    for (var i = 0; i < lotes.length; i++) {
      if (d <= lotes[i].fim && (!lotes[i].ini || d >= lotes[i].ini)) return lotes[i];
    }
    return null;
  }

  var now = new Date();
  var atual = loteAtual(now);
  var E = C.ensaio || {};

  // Cards dos lotes
  var lotesEl = $("#lotes");
  if (lotesEl) {
    lotesEl.innerHTML = lotes.map(function (l) {
      var estado = l === atual ? "is-current" : (now > l.fim ? "is-past" : "");
      var tag = l === atual ? "Aberto agora" : (now > l.fim ? "Encerrado" : "Em breve");
      var data = l.de ? fmtDM(l.de) + " a " + fmtDM(l.ate) : "até " + fmtDM(l.ate);
      var preco = l.preco
        ? '<p class="lote__price"><small>a partir de</small>' + money(l.preco) + "</p>" +
          (E.parcelas ? '<p class="lote__date">ou em até ' + E.parcelas + "x</p>" : "")
        : '<p class="lote__price lote__price--ask">Valor no WhatsApp</p>';
      return '<article class="lote ' + estado + ' reveal"><span class="lote__tag">' + tag + "</span>" +
        "<h3>" + l.nome + '</h3><p class="lote__date">' + data + "</p>" + preco +
        '<p class="lote__pitch">' + l.chamada + "</p></article>";
    }).join("");
  }

  // O que inclui
  var inclui = $("#inclui");
  if (inclui) {
    var itens = [
      E.duracao ? E.duracao + " de ensaio guiado" : "Ensaio guiado do início ao fim",
      E.fotos ? E.fotos + " fotos editadas" : "Fotos editadas em alta resolução",
      "Cenário de Natal exclusivo",
      "Consultoria de look",
      "Entrega antes do Natal"
    ];
    if (E.parcelas) itens.push("Parcelamento em até " + E.parcelas + "x");
    inclui.innerHTML = itens.map(function (t) { return "<li>" + t + "</li>"; }).join("");
  }

  // Chips e textos de urgência
  var chipLote = $("#chip-lote"), chipVagas = $("#chip-vagas"), topText = $("#topbar-text");
  if (E.vagasRestantes) {
    chipVagas.hidden = false;
    chipVagas.classList.add("chip--hot");
    chipVagas.textContent = "🔥 Restam " + E.vagasRestantes + " horários";
  }
  if (E.parcelas) {
    var fp = $("#faq-preco");
    if (fp) fp.textContent = "É a foto que você vai olhar por 20 anos, em todos os Natais. E dá para parcelar em até " + E.parcelas + "x. Me chama no WhatsApp que eu te passo os detalhes.";
  }

  var cdLabel = $("#countdown-label");
  if (atual) {
    chipLote.textContent = "🎄 " + atual.nome + " aberto até " + fmtDM(atual.ate);
    cdLabel.textContent = (atual.id === "expresso" ? "O encaixe expresso termina em" : "O " + atual.nome + " termina em");
    var alertEl = $("#booking-alert span");
    if (alertEl) alertEl.textContent = atual.chamada + (E.vagasRestantes ? " Restam " + E.vagasRestantes + " horários." : "");
  } else {
    chipLote.textContent = "🎄 Agenda de Natal 2026 encerrada";
    $("#countdown").hidden = true;
    topText.textContent = "Agenda de Natal encerrada · entre na lista de espera para o ensaio de família em janeiro";
    var fs = $("#final-sub");
    if (fs) fs.textContent = "Perdeu o Natal? Me chama para entrar na lista do ensaio de família de janeiro.";
  }

  // Contagem regressiva
  function tick() {
    if (!atual) return;
    var diff = Math.max(0, atual.fim - new Date());
    var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    $("#cd-d").textContent = pad(d); $("#cd-h").textContent = pad(h);
    $("#cd-m").textContent = pad(m); $("#cd-s").textContent = pad(s);
    var resto = d > 0 ? d + "d " + pad(h) + "h " + pad(m) + "min" : pad(h) + "h " + pad(m) + "min " + pad(s) + "s";
    topText.textContent = atual.nome + " do Ensaio de Natal termina em " + resto + (E.vagasRestantes ? " · restam " + E.vagasRestantes + " horários" : "");
    if (diff === 0) location.reload();
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Agendamento ----------
  var form = $("#booking-form");
  if (form) {
    var datesEl = $("#dates"), perEl = $("#periodos"), flex = $("#flex-date");
    var state = { data: null, periodo: null, quem: [] };
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var ultimo = parseDay(C.ultimoDiaAgenda || "2026-12-22");
    var html = "";
    for (var d = new Date(hoje); d <= ultimo; d.setDate(d.getDate() + 1)) {
      var l = loteDoDia(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12));
      var mark = d.getTime() === hoje.getTime() ? "hoje" : (l && l.id === "expresso" ? "expresso" : "");
      var label = DIAS[d.getDay()] + ", " + pad(d.getDate()) + "/" + pad(d.getMonth() + 1);
      html += '<button type="button" class="date" role="radio" aria-checked="false" data-v="' + label + '">' +
        "<small>" + DIAS[d.getDay()] + "</small><b>" + pad(d.getDate()) + "</b><i>" + (mark || "&nbsp;") + "</i></button>";
    }
    datesEl.innerHTML = html || '<p class="form__note">Agenda de Natal encerrada. Me chame para a lista de janeiro.</p>';

    perEl.innerHTML = (C.periodos || []).map(function (p) {
      return '<button type="button" class="pill" role="radio" aria-checked="false" data-v="' + p + '">' + p + "</button>";
    }).join("");

    function radio(container, key) {
      container.addEventListener("click", function (e) {
        var b = e.target.closest("[data-v]"); if (!b) return;
        $$("[data-v]", container).forEach(function (x) { x.setAttribute("aria-checked", "false"); });
        b.setAttribute("aria-checked", "true");
        state[key] = b.getAttribute("data-v");
        render();
      });
    }
    radio(datesEl, "data");
    radio(perEl, "periodo");

    flex.addEventListener("change", function () {
      datesEl.classList.toggle("is-disabled", flex.checked);
      render();
    });

    $("#quem").addEventListener("click", function (e) {
      var b = e.target.closest(".pill"); if (!b) return;
      var on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(on));
      var v = b.getAttribute("data-v");
      state.quem = on ? state.quem.concat(v) : state.quem.filter(function (x) { return x !== v; });
      render();
    });

    var pessoas = $("#pessoas");
    $$(".stepper button").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = Math.min(20, Math.max(1, (parseInt(pessoas.value, 10) || 1) + Number(b.getAttribute("data-step"))));
        pessoas.value = n; render();
      });
    });
    ["#pessoas", "#idades", "#nome"].forEach(function (s) { $(s).addEventListener("input", render); });

    function msg() {
      var nome = $("#nome").value.trim();
      var lines = [];
      lines.push(baseMsg + (nome ? ". Meu nome é " + nome + "." : "."));
      lines.push("");
      lines.push("📅 Data: " + (flex.checked ? "tenho flexibilidade" : (state.data || "a combinar")));
      lines.push("🕐 Período: " + (state.periodo || "a combinar"));
      if (state.quem.length) lines.push("👨‍👩‍👧 Quem vai: " + state.quem.join(", "));
      lines.push("👥 Pessoas: " + (pessoas.value || "?"));
      var idades = $("#idades").value.trim();
      if (idades) lines.push("🧒 Idade das crianças: " + idades);
      lines.push("");
      lines.push("Tem horário disponível?");
      return lines.join("\n");
    }
    function render() { $("#preview-msg").textContent = msg(); }
    render();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!state.data && !flex.checked) {
        datesEl.classList.remove("shake"); void datesEl.offsetWidth; datesEl.classList.add("shake");
        datesEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      track("Lead", { content_name: "agendamento-site" });
      window.open(waUrl(msg()), "_blank", "noopener");
    });
  }

  // ---------- Header, menu, barra mobile ----------
  var header = $("#header"), burger = $("#burger"), nav = $("#nav"), mbar = $("#mbar"), hero = $(".hero");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    if (mbar) mbar.classList.toggle("is-on", y > (hero ? hero.offsetHeight * 0.6 : 400));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);
  onScroll();
  function closeMenu() { nav.classList.remove("is-open"); burger.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open); burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", closeMenu); });

  // ---------- Depoimentos ----------
  var reviews = $("#reviews");
  $$(".reviews__nav .round").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = $(".review", reviews);
      reviews.scrollBy({ left: Number(b.getAttribute("data-dir")) * (card.offsetWidth + 22), behavior: "smooth" });
    });
  });

  // ---------- Lightbox ----------
  var figs = $$("#gallery .g"), lb = $("#lightbox"), lbImg = $("img", lb), idx = 0;
  function show(i) { idx = (i + figs.length) % figs.length; lbImg.src = figs[idx].getAttribute("data-full"); lbImg.alt = $("img", figs[idx]).alt; }
  function openLb(i) { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
  figs.forEach(function (f, i) { f.addEventListener("click", function () { openLb(i); }); });
  $(".lightbox__close", lb).addEventListener("click", closeLb);
  $(".lightbox__prev", lb).addEventListener("click", function () { show(idx - 1); });
  $(".lightbox__next", lb).addEventListener("click", function () { show(idx + 1); });
  $(".lightbox__cta a", lb).addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    tx = null;
  });

  // ---------- Balão do WhatsApp ----------
  var bubble = $("#fab-bubble");
  if (!store("la_bubble")) {
    setTimeout(function () {
      if (atual && atual.id === "expresso") $("#fab-text").textContent = "Oi! Ainda tenho encaixe expresso antes da ceia 🎄 Quer ver?";
      bubble.hidden = false;
    }, 7000);
  }
  $("#fab-close").addEventListener("click", function () { bubble.hidden = true; store("la_bubble", "1"); });

  // ---------- Animações de entrada e contadores ----------
  var revealSel = ".section__head, .perk, .g, .step, .review, .booking__intro, .card, .about__media, .about__text, .service, .faq details, .countdown, .final__inner";
  $$(revealSel).forEach(function (el) { el.classList.add("reveal"); });
  function countUp(el) {
    var end = Number(el.getAttribute("data-count")), t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal, [data-count]").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    $$("[data-count]").forEach(function (el) { el.textContent = Number(el.getAttribute("data-count")).toLocaleString("pt-BR"); });
  }

  // ---------- Neve no topo ----------
  var cv = $("#snow");
  if (cv && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = cv.getContext("2d"), flakes = [], W, H, visible = true, dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() {
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(140, W / 9));
      flakes = [];
      for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.6 + .6, s: Math.random() * .6 + .25, w: Math.random() * 2 * Math.PI, o: Math.random() * .5 + .35 });
    }
    function draw() {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < flakes.length; i++) {
          var f = flakes[i];
          f.y += f.s; f.w += .01; f.x += Math.sin(f.w) * .35;
          if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283);
          ctx.fillStyle = "rgba(255,255,255," + f.o + ")"; ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener("resize", size);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
    }
  }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
