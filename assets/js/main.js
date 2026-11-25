/* ============================================================
   Taranpreet Kaur — Digital Marketing Portfolio
   Interactions: theme toggle, scroll progress, scrollspy,
   mobile nav, reveal animations, counters, typed rotator,
   case-study tabs, back-to-top, contact form, footer year.
   ============================================================ */

const PORTFOLIO_EMAIL = "taranpreet8219@gmail.com"; // TODO: replace with your professional email
// Public Web3Forms access key (safe to keep in client code). Get one at https://web3forms.com
const WEB3FORMS_KEY = "";

const $ = (selector, scope) => (scope || document).querySelector(selector);
const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

/* ---------- Theme ---------- */
const html = document.documentElement;
const themeToggle = $("#themeToggle");

const applyTheme = (theme) => {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("tannu-theme", theme);
  const dark = theme === "dark";
  $("#iconSun").hidden = !dark;
  $("#iconMoon").hidden = dark;
};

const initTheme = () => {
  const saved = localStorage.getItem("tannu-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    applyTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
}

/* ---------- Scroll progress + back to top + nav state + reveals + counters ---------- */
const scrollBar = $("#scrollProgressBar");
const backToTop = $("#backToTop");
const nav = $("#nav");
const NAV_SECTIONS = ["home", "about", "expertise", "experience", "case-studies", "projects", "approach", "contact"];
const countedElements = new Set();

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
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * eased));
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

  // Backup path: open the visitor's email app and show a copyable message.
  const sendViaMailto = (name, email, message) => {
    const subjectText = `Portfolio enquiry from ${name || "a visitor"}`;
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(`${name}\n${email}\n\n${message}`);
    window.location.href = `mailto:${PORTFOLIO_EMAIL}?subject=${subject}&body=${body}`;
    const fallback = $("#formFallback");
    const fallbackText = $("#fallbackText");
    if (fallback && fallbackText) {
      fallbackText.value = `To: ${PORTFOLIO_EMAIL}\nSubject: ${subjectText}\n\n${name}\n${email}\n\n${message}`;
      fallback.hidden = false;
      $("#copyStatus").textContent = "";
    }
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    // Bots fill the hidden honeypot field; silently drop those.
    if (data.get("botcheck")) return;

    // No Web3Forms key configured -> use the email-app method only.
    if (!WEB3FORMS_KEY) { sendViaMailto(name, email, message); return; }

    submitBtn.disabled = true;
    setStatus("Sending…");
    $("#formFallback").hidden = true;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio enquiry from ${name || "a visitor"}`,
          from_name: "Portfolio contact form",
          name, email, message,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Request failed");
      contactForm.reset();
      setStatus("Thank you! Your message has been sent. I'll reply soon.");
    } catch (err) {
      setStatus("Couldn't send automatically. Please use the email option below.");
      sendViaMailto(name, email, message);
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

/* ---------- Footer year ---------- */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
