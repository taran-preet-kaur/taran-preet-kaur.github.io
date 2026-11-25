/* ============================================================
   Taranpreet Kaur — Digital Marketing Portfolio
   Interactions: theme toggle, scroll progress, scrollspy,
   mobile nav, reveal animations, counters, typed rotator,
   case-study tabs, back-to-top, contact form, footer year.
   ============================================================ */

const PORTFOLIO_EMAIL = "taranpreet8219@gmail.com"; // TODO: replace with your professional email
// Public Web3Forms access key (safe to keep in client code). Get one at https://web3forms.com
const WEB3FORMS_KEY = "4352d5f7-4ea4-43a9-bbc6-3ea3b1f8d9bf";

const $ = (selector, scope) => (scope || document).querySelector(selector);
const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

/* ---------- Theme ---------- */
// Three modes: light, dark, system (follows the OS and updates live).
const html = document.documentElement;
const themeButtons = $$("#themeSwitch [data-mode]");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const getMode = () => {
  try { const m = localStorage.getItem("tannu-theme"); return ["light", "dark", "system"].includes(m) ? m : "system"; }
  catch (e) { return "system"; }
};
const applyMode = (mode, save) => {
  const dark = mode === "dark" || (mode === "system" && systemDark.matches);
  html.setAttribute("data-theme", dark ? "dark" : "light");
  html.setAttribute("data-mode", mode);
  if (save) { try { localStorage.setItem("tannu-theme", mode); } catch (e) { /* storage blocked */ } }
  themeButtons.forEach((b) => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("active", on);
    b.setAttribute("aria-checked", String(on));
  });
};
themeButtons.forEach((b) => b.addEventListener("click", () => applyMode(b.dataset.mode, true)));
const onSystemChange = () => { if (getMode() === "system") applyMode("system", false); };
if (systemDark.addEventListener) systemDark.addEventListener("change", onSystemChange);
else if (systemDark.addListener) systemDark.addListener(onSystemChange);
applyMode(getMode(), false);

// Small icons on the contact form labels.
const LABEL_ICONS = { "cf-name": "user", "cf-email": "mail", "cf-phone": "phone", "cf-company": "building", "cf-service": "target", "cf-budget": "wallet", "cf-timeline": "clock", "cf-source": "search", "cf-message": "message" };
Object.entries(LABEL_ICONS).forEach(([id, icon]) => {
  const label = document.querySelector(`label[for="${id}"]`);
  if (!label) return;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "ico");
  const use = document.createElementNS(ns, "use");
  use.setAttribute("href", `#i-${icon}`);
  svg.appendChild(use);
  label.prepend(svg);
});

/* ---------- Scroll progress + back to top + nav state + reveals + counters ---------- */
const scrollBar = $("#scrollProgressBar");
const backToTop = $("#backToTop");
const nav = $("#nav");
const NAV_SECTIONS = ["home", "about", "expertise", "experience", "case-studies", "projects", "approach", "toolkit", "contact"];
const countedElements = new Set();

// Years of experience is computed from the start date so it never goes stale.
$$("[data-years-since]").forEach((el) => {
  const since = new Date(el.getAttribute("data-years-since"));
  const years = Math.max(0, Math.floor((Date.now() - since.getTime()) / (365.25 * 24 * 3600 * 1000)));
  el.setAttribute("data-count", String(years));
});

const checkReveals = () => {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  $$(".reveal").forEach((el) => {
    if (el.classList.contains("in")) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 80 && rect.bottom > -80) {
      el.classList.add("in");
    }
  });
};

const runCounter = (el) => {
  const target = parseFloat(el.getAttribute("data-count")) || 0;
  const suffix = el.getAttribute("data-suffix") || "";
  const duration = 1400;
  const start = performance.now();
  const step = () => {
    const p = Math.min(Math.max((performance.now() - start) / duration, 0), 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const checkCounters = () => {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  $$("[data-count]").forEach((el) => {
    if (countedElements.has(el)) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 80 && rect.bottom > -80) {
      countedElements.add(el);
      runCounter(el);
    }
  });
};

const onScroll = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const progress = max > 0 ? doc.scrollTop / max : 0;
  if (scrollBar) scrollBar.style.transform = `scaleX(${progress})`;

  if (nav) nav.classList.toggle("scrolled", doc.scrollTop > 8);

  if (backToTop) backToTop.classList.toggle("show", doc.scrollTop > 480);

  checkReveals();
  checkCounters();

  let current = "home";
  for (const id of NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (el && el.offsetTop - 120 <= doc.scrollTop) current = id;
  }
  $$(".nav-links a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
window.addEventListener("load", onScroll);
onScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Mobile nav ---------- */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) nav.classList.remove("open");
  });
}

/* ---------- Typed role rotator ---------- */
const typedEl = $("#typed");
const ROLES = ["Digital Marketing Specialist", "SEO Specialist", "PPC Strategist", "AEO & GEO Specialist"];
let roleIndex = 0;
let typedTimer = null;

const setRole = (word) => {
  if (!typedEl) return;
  typedEl.textContent = word;
  typedEl.classList.remove("swap");
  void typedEl.offsetWidth; // restart animation
  typedEl.classList.add("swap");
};

const startTyped = () => {
  if (typedTimer) clearInterval(typedTimer);
  typedTimer = setInterval(() => {
    roleIndex = (roleIndex + 1) % ROLES.length;
    setRole(ROLES[roleIndex]);
  }, 2200);
};

const stopTyped = () => {
  if (typedTimer) clearInterval(typedTimer);
  typedTimer = null;
};

if (typedEl) {
  setRole(ROLES[0]);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    startTyped();
  }
}

/* ---------- Case study tabs ---------- */
const caseTabs = $$(".case-tab");
const caseItems = $$(".case");

if (caseTabs.length && caseItems.length) {
  const firstTab = caseTabs[0];
  firstTab.classList.add("active");
  firstTab.setAttribute("aria-selected", "true");
  const firstItem = caseItems.find((item) => item.getAttribute("data-case") === firstTab.getAttribute("data-case"));
  if (firstItem) {
    firstItem.hidden = false;
    firstItem.classList.add("active");
  }
}

caseTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    caseTabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const key = tab.getAttribute("data-case");
    caseItems.forEach((item) => {
      const match = item.getAttribute("data-case") === key;
      item.hidden = !match;
      if (match) item.classList.add("active");
      else item.classList.remove("active");
    });
  });
});

/* ---------- Contact form -> mailto ---------- */
const contactForm = $("#contactForm");
if (contactForm) {
  const sendStatus = $("#sendStatus");
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const setStatus = (text) => { if (sendStatus) sendStatus.textContent = text; };

  const msgBox = $("#cf-message");
  const charCount = $("#charCount");
  const updateCount = () => { if (msgBox && charCount) charCount.textContent = `${msgBox.value.length} / ${msgBox.maxLength}`; };
  if (msgBox) msgBox.addEventListener("input", updateCount);

  // Backup path: open the visitor's email app and show a copyable message.
  const sendViaMailto = (subjectText, details) => {
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(details);
    window.location.href = `mailto:${PORTFOLIO_EMAIL}?subject=${subject}&body=${body}`;
    const fallback = $("#formFallback");
    const fallbackText = $("#fallbackText");
    if (fallback && fallbackText) {
      fallbackText.value = `To: ${PORTFOLIO_EMAIL}\nSubject: ${subjectText}\n\n${details}`;
      fallback.hidden = false;
      $("#copyStatus").textContent = "";
    }
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const val = (k) => (data.get(k) || "").toString().trim();
    const fields = {
      name: val("name"), email: val("email"), phone: val("phone"), company: val("company"),
      service: val("service"), budget: val("budget"), timeline: val("timeline"),
      source: val("source"), message: val("message"),
    };
    const subjectText = `Portfolio enquiry: ${fields.service || "General"} - ${fields.name || "a visitor"}`;
    const details = [
      ["Name", fields.name], ["Email", fields.email], ["Phone", fields.phone],
      ["Company / website", fields.company], ["Interested in", fields.service],
      ["Monthly budget", fields.budget], ["Timeline", fields.timeline],
      ["Heard about me via", fields.source],
    ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${fields.message}`;

    // Bots fill the hidden honeypot field; silently drop those.
    if (data.get("botcheck")) return;

    // No Web3Forms key configured -> use the email-app method only.
    if (!WEB3FORMS_KEY) { sendViaMailto(subjectText, details); return; }

    submitBtn.disabled = true;
    setStatus("Sending…");
    $("#formFallback").hidden = true;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: subjectText,
          from_name: "Portfolio contact form",
          replyto: fields.email,
          ...fields,
          consent: "Agreed to be contacted",
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Request failed");
      contactForm.reset();
      updateCount();
      setStatus("Thank you! Your message has been sent. I'll reply soon.");
    } catch (err) {
      setStatus("Couldn't send automatically. Please use the email option below.");
      sendViaMailto(subjectText, details);
    } finally {
      submitBtn.disabled = false;
    }
  });

  const copyBtn = $("#copyMessage");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const fallbackText = $("#fallbackText");
      const status = $("#copyStatus");
      try {
        await navigator.clipboard.writeText(fallbackText.value);
        status.textContent = "Copied!";
      } catch (err) {
        fallbackText.select();
        status.textContent = "Press Ctrl+C to copy.";
      }
    });
  }
}

/* ============================================================
   Marketer UI layer
   ============================================================ */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const toast = $("#toast");
let toastTimer = null;
const showToast = (text) => {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
};

/* ---------- Hero KPI dashboard (real figures from the case studies) ---------- */
const KPIS = {
  roas: { from: 4.67, to: 6.55, fmt: (v) => `${v.toFixed(2)}x`, label: "A2A · Google Ads, Oct vs Sep (same 1–23 day window)", a: "Sep", b: "Oct", better: "up" },
  cpa:  { from: 50, to: 34, fmt: (v) => `A$${Math.round(v)}`, label: "All Smart Kitchens · reported CPA movement", a: "Before", b: "After", better: "down" },
  conv: { from: 54, to: 106, fmt: (v) => String(Math.round(v)), label: "All Smart Kitchens · conversions, Jun vs Jul", a: "Jun", b: "Jul", better: "up" },
};
const dashTabs = $$(".dash-tab");
const dashValue = $("#dashValue");
let dashKey = "roas";
let dashTimer = null;
let dashRaf = null;
let dashRun = 0;
let dashFinal = null;

const drawSpark = (k) => {
  const line = $("#sparkLine"), area = $("#sparkArea"), ca = $("#sparkA"), cb = $("#sparkB");
  if (!line) return;
  const lo = Math.min(k.from, k.to), hi = Math.max(k.from, k.to);
  const y = (v) => 78 - ((v - lo) / (hi - lo || 1)) * 56; // 22..78 (SVG y grows downward)
  const x1 = 18, x2 = 282, y1 = y(k.from), y2 = y(k.to), mid = (x1 + x2) / 2;
  const d = `M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  line.setAttribute("d", d);
  area.setAttribute("d", `${d} L${x2} 96 L${x1} 96 Z`);
  ca.setAttribute("cx", x1); ca.setAttribute("cy", y1);
  cb.setAttribute("cx", x2); cb.setAttribute("cy", y2);
  line.classList.remove("draw"); void line.getBoundingClientRect(); line.classList.add("draw");
};

const showKpi = (key) => {
  const k = KPIS[key];
  if (!k || !dashValue) return;
  dashKey = key;
  dashTabs.forEach((t) => {
    const on = t.dataset.kpi === key;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", String(on));
  });
  $("#dashLabel").textContent = k.label;
  $("#sparkFrom").textContent = `${k.a}: ${k.fmt(k.from)}`;
  $("#sparkTo").textContent = `${k.b}: ${k.fmt(k.to)}`;
  const delta = $("#dashDelta");
  const pct = Math.abs(((k.to - k.from) / k.from) * 100);
  const improved = (k.to > k.from) === (k.better === "up");
  delta.className = `delta ${improved ? "up" : "down"}`;
  delta.textContent = `${k.to > k.from ? "▲" : "▼"} ${pct.toFixed(0)}% vs ${k.fmt(k.from)}`;
  drawSpark(k);
  cancelAnimationFrame(dashRaf);
  clearTimeout(dashFinal);
  const run = ++dashRun; // ignore frames from any earlier animation
  if (reduceMotion) { dashValue.textContent = k.fmt(k.to); return; }
  const t0 = performance.now();
  const tick = () => {
    if (run !== dashRun) return;
    // Clamp to 0..1: the rAF timestamp can precede t0, which gave negative progress.
    const p = Math.min(Math.max((performance.now() - t0) / 900, 0), 1);
    const e = 1 - Math.pow(1 - p, 3);
    dashValue.textContent = k.fmt(k.from + (k.to - k.from) * e);
    if (p < 1) dashRaf = requestAnimationFrame(tick);
  };
  dashRaf = requestAnimationFrame(tick);
  // Guarantee the final figure even if frames are throttled (e.g. background tab).
  dashFinal = setTimeout(() => { if (run === dashRun) dashValue.textContent = k.fmt(k.to); }, 1000);
};

if (dashValue) {
  const order = Object.keys(KPIS);
  const startDash = () => {
    if (reduceMotion) return;
    clearInterval(dashTimer);
    dashTimer = setInterval(() => showKpi(order[(order.indexOf(dashKey) + 1) % order.length]), 5000);
  };
  dashTabs.forEach((t) => t.addEventListener("click", () => { showKpi(t.dataset.kpi); startDash(); }));
  const dash = $("#heroDash");
  dash.addEventListener("mouseenter", () => clearInterval(dashTimer));
  dash.addEventListener("mouseleave", startDash);
  showKpi("roas");
  startDash();
}

/* ---------- Hero cursor glow + 3D tilt on the dashboard ---------- */
const heroEl = $("#home");
if (heroEl && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  heroEl.addEventListener("mousemove", (e) => {
    const r = heroEl.getBoundingClientRect();
    heroEl.style.setProperty("--hx", `${e.clientX - r.left}px`);
    heroEl.style.setProperty("--hy", `${e.clientY - r.top}px`);
  });
  const dash = $("#heroDash");
  if (dash) {
    dash.addEventListener("mousemove", (e) => {
      const r = dash.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      dash.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
    });
    dash.addEventListener("mouseleave", () => { dash.style.transform = ""; });
  }
}

/* ---------- Spotlight follow on cards ---------- */
$$(".card, .project, .step").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Funnel explorer ---------- */
const FUNNEL = {
  attract: { title: "Attract – be found", text: "Organic and paid visibility: technical and on-page SEO, keyword and content opportunities, AI-search (AEO/GEO) visibility and social content.", tags: ["Technical SEO", "On-page SEO", "AEO & GEO", "Keyword research", "Search Console", "Ahrefs", "SEMrush", "Search Atlas"] },
  engage: { title: "Engage – earn the click", text: "Turning visibility into qualified visits: Search and Shopping campaigns, ad and landing-page relevance, service-intent coverage and social campaigns.", tags: ["Google Search", "Shopping", "Meta Ads", "Content clarity", "Service intent", "Microsoft Clarity"] },
  convert: { title: "Convert – drive the action", text: "Campaign structure, bidding and budget monitoring against the real outcome, with purchase or lead conversions treated as the primary goal.", tags: ["Performance Max", "Bidding & budgets", "CPA / ROAS", "Conversion actions", "Meta Pixel", "Shopify"] },
  measure: { title: "Measure – prove and improve", text: "Validating tracking and attribution first, then reporting, audits and clear recommendations the team can prioritise and act on.", tags: ["GA4", "Google Tag Manager", "UTM checks", "Attribution", "AgencyAnalytics", "ClickUp", "Audit reports"] },
};
const fStages = $$(".f-stage");
const showStage = (key) => {
  const s = FUNNEL[key];
  if (!s) return;
  fStages.forEach((b) => {
    const on = b.dataset.stage === key;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  $("#fdTitle").textContent = s.title;
  $("#fdText").textContent = s.text;
  const tags = $("#fdTags");
  tags.textContent = "";
  s.tags.forEach((t) => { const sp = document.createElement("span"); sp.textContent = t; tags.appendChild(sp); });
  const box = $("#funnelDetail");
  box.classList.remove("swap"); void box.offsetWidth; box.classList.add("swap");
};
if (fStages.length) {
  fStages.forEach((b) => {
    b.addEventListener("click", () => showStage(b.dataset.stage));
    b.addEventListener("mouseenter", () => { if (window.matchMedia("(hover: hover)").matches) showStage(b.dataset.stage); });
  });
  showStage("attract");
}

/* ---------- Case study before/after bars ---------- */
const fmtNum = (v, prefix, suffix) => {
  const n = v >= 1000 ? Math.round(v).toLocaleString("en-US") : (Number.isInteger(v) ? String(v) : v.toFixed(2));
  return `${prefix || ""}${n}${suffix || ""}`;
};
$$(".cmp").forEach((el) => {
  const from = parseFloat(el.dataset.from), to = parseFloat(el.dataset.to);
  const prefix = el.dataset.prefix || "", suffix = el.dataset.suffix || "";
  const pct = ((to - from) / from) * 100;
  const good = el.dataset.good;
  const tone = good === "neutral" ? "" : ((to > from) === (good === "up") ? "good" : "bad");
  const title = document.createElement("div");
  title.className = "cmp-title";
  const name = document.createElement("span");
  name.textContent = el.dataset.label;
  const badge = document.createElement("span");
  badge.className = `cmp-badge ${tone}`;
  badge.textContent = `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
  title.append(name, badge);
  el.appendChild(title);
  const max = Math.max(from, to);
  [["from", from, el.dataset.fromLabel], ["to", to, el.dataset.toLabel]].forEach(([cls, v, lbl]) => {
    const row = document.createElement("div");
    row.className = "cmp-row";
    const l = document.createElement("span"); l.textContent = lbl;
    const track = document.createElement("div"); track.className = "cmp-track";
    const bar = document.createElement("div"); bar.className = `cmp-bar ${cls}`; bar.dataset.w = String((v / max) * 100);
    track.appendChild(bar);
    const val = document.createElement("span"); val.className = "cmp-val"; val.textContent = fmtNum(v, prefix, suffix);
    row.append(l, track, val);
    el.appendChild(row);
  });
});
const animateBars = () => {
  $$(".case.active .cmp-bar").forEach((b) => { b.style.width = "0"; });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$(".case.active .cmp-bar").forEach((b) => { b.style.width = `${b.dataset.w}%`; });
  }));
};
caseTabs.forEach((tab) => tab.addEventListener("click", animateBars));
// Arrow-key navigation between case tabs
caseTabs.forEach((tab, i) => tab.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const next = caseTabs[(i + (e.key === "ArrowRight" ? 1 : -1) + caseTabs.length) % caseTabs.length];
  next.focus(); next.click();
}));
const caseSection = $("#case-studies");
if (caseSection && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting)) { animateBars(); io.disconnect(); }
  }, { threshold: 0.2 });
  io.observe(caseSection);
} else { animateBars(); }

/* ---------- Campaign metrics calculator ---------- */
const calcIds = ["cSpend", "cRevenue", "cImpr", "cClicks", "cConv"];
if (calcIds.every((id) => $(`#${id}`))) {
  const defaults = { cSpend: 50000, cRevenue: 200000, cImpr: 400000, cClicks: 8000, cConv: 250 };
  const num = (id) => Math.max(0, parseFloat($(`#${id}`).value) || 0);
  const safeDiv = (a, b) => (b > 0 ? a / b : null);
  const calc = () => {
    const cur = $("#calcCur").value;
    const spend = num("cSpend"), rev = num("cRevenue"), impr = num("cImpr"), clicks = num("cClicks"), conv = num("cConv");
    const money = (v) => (v === null ? "–" : `${cur}${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
    const pctf = (v) => (v === null ? "–" : `${(v * 100).toFixed(2)}%`);
    const roas = safeDiv(rev, spend);
    $("#rRoas").textContent = roas === null ? "–" : `${roas.toFixed(2)}x`;
    $("#rRoasNote").textContent = roas === null ? "Enter your ad spend" : `${cur}${roas.toFixed(2)} revenue for every ${cur}1 spent`;
    $("#rCpa").textContent = money(safeDiv(spend, conv));
    $("#rCpc").textContent = money(safeDiv(spend, clicks));
    $("#rCtr").textContent = pctf(safeDiv(clicks, impr));
    $("#rCvr").textContent = pctf(safeDiv(conv, clicks));
    $("#rAov").textContent = money(safeDiv(rev, conv));
    const m = Math.max(spend, rev, 1);
    $("#sbSpend").style.width = `${(spend / m) * 100}%`;
    $("#sbRev").style.width = `${(rev / m) * 100}%`;
  };
  [...calcIds, "calcCur"].forEach((id) => $(`#${id}`).addEventListener("input", calc));
  $("#calcReset").addEventListener("click", () => {
    calcIds.forEach((id) => { $(`#${id}`).value = defaults[id]; });
    calc();
  });
  calc();
}

/* ---------- Copy email ---------- */
const copyEmailBtn = $("#copyEmail");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(PORTFOLIO_EMAIL); showToast("Email address copied"); }
    catch (err) { showToast(`Email me at ${PORTFOLIO_EMAIL}`); }
  });
}

/* ---------- Footer year ---------- */
// Every year label (hero kicker, footer) follows the current calendar year.
const currentYear = String(new Date().getFullYear());
$$("[data-current-year], #year").forEach((el) => { el.textContent = currentYear; });
