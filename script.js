// ====== EDIT THESE DETAILS ======
const PROFILE = {
  fullName: "Ajay Kumar Maurya",
  email: "ajaykrsoe@gmail.com",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
  resumeFile: "resume.pdf" // Put resume.pdf in the same folder (optional)
};

const SKILLS = [
  "OCI", "Python", "SQL", "Selenium", "FastAPI", "REST APIs",
  "Oracle Data Integrator (ODI)", "GoldenGate", "Linux", "Git",
  "Data Engineering", "Cloud Networking (Basics)", "Automation", "Django"
];

const PROJECTS = [
  {
    title: "Oracle ATP Backup Pipeline (GoldenGate)",
    desc: "Automated backup pipeline with table/column filtration for different applications.",
    tags: ["OCI", "GoldenGate", "SQL"],
    category: "Data/ETL",
    live: "#",
    code: "#",
    details:
      "Designed an automation pipeline to manage backup/sync workflows with controlled filtration. Focused on reliability, observability, and clean SQL conventions."
  },
  {
    title: "OIC Instance Testing Automation",
    desc: "Python Selenium automation framework to test Oracle Integration Cloud flows with multiple inputs.",
    tags: ["Python", "Selenium", "Automation"],
    category: "Automation",
    live: "#",
    code: "#",
    details:
      "Built reusable test utilities, input-driven execution, and reporting-style outputs. Reduced repetitive manual checks and improved consistency."
  },
  {
    title: "Portfolio Website (HTML/CSS/JS)",
    desc: "A clean, responsive portfolio with dark mode, filters, modal, and animations.",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "Web",
    live: "#",
    code: "#",
    details:
      "Single page layout with mobile navigation, theme toggle, IntersectionObserver reveal animations, and a mailto contact form."
  }
];

const EXPERIENCE = [
  {
    role: "Software Engineer / Application Engineer",
    company: "Oracle India",
    time: "2022 — Present",
    points: [
      "Worked on OCI administration and data engineering workflows.",
      "Built Python automation scripts and tooling for reliability and speed.",
      "Hands-on SQL + ETL analysis for data validation and fixes."
    ]
  },
  {
    role: "Online Tutor (Part-time)",
    company: "Independent",
    time: "Ongoing",
    points: [
      "Teach Engineering Mathematics and Computer Science subjects.",
      "Create structured notes and problem sets for students."
    ]
  }
];

// ====== Helpers ======
const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

function clampText(text, max = 115) {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

// ====== Theme ======
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const icon = $("#themeToggle .icon");
  if (icon) icon.textContent = theme === "light" ? "🌞" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    setTheme(saved);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

// ====== Mobile menu ======
function initMobileMenu() {
  const burger = $("#burger");
  const menu = $("#mobileMenu");

  if (!burger || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!isOpen));
    menu.hidden = isOpen;
  });

  // Close menu on click link
  $$(".mobile__link", menu).forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Close menu on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

// ====== Skills render ======
function renderSkills() {
  const box = $("#skillsChips");
  if (!box) return;

  box.innerHTML = "";
  SKILLS.forEach((s) => {
    const span = document.createElement("span");
    span.className = "chip";
    span.textContent = s;
    box.appendChild(span);
  });
}

// ====== Projects render + filter ======
function uniqueCategories(items) {
  const set = new Set(items.map((p) => p.category));
  return ["All", ...Array.from(set)];
}

function renderFilters(categories) {
  const wrap = $("#projectFilters");
  if (!wrap) return;

  wrap.innerHTML = "";
  categories.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.type = "button";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      $$(".filter-btn", wrap).forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      renderProjects(cat);
    });
    wrap.appendChild(btn);
  });
}

function renderProjects(category = "All") {
  const grid = $("#projectGrid");
  if (!grid) return;

  const items = category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category);

  grid.innerHTML = "";
  items.forEach((p) => {
    const card = document.createElement("article");
    card.className = "project";

    const title = document.createElement("h3");
    title.className = "project__title";
    title.textContent = p.title;

    const desc = document.createElement("p");
    desc.className = "project__desc";
    desc.textContent = clampText(p.desc, 140);

    const meta = document.createElement("div");
    meta.className = "project__meta";
    p.tags.slice(0, 4).forEach((t) => {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = t;
      meta.appendChild(b);
    });

    const actions = document.createElement("div");
    actions.className = "project__actions";

    const detailsBtn = document.createElement("button");
    detailsBtn.className = "small-btn";
    detailsBtn.type = "button";
    detailsBtn.textContent = "Details";
    detailsBtn.addEventListener("click", () => openModal(p));

    const liveBtn = document.createElement("a");
    liveBtn.className = "small-btn";
    liveBtn.textContent = "Live";
    liveBtn.href = p.live || "#";
    liveBtn.target = "_blank";
    liveBtn.rel = "noreferrer";

    const codeBtn = document.createElement("a");
    codeBtn.className = "small-btn";
    codeBtn.textContent = "Code";
    codeBtn.href = p.code || "#";
    codeBtn.target = "_blank";
    codeBtn.rel = "noreferrer";

    actions.appendChild(detailsBtn);
    actions.appendChild(liveBtn);
    actions.appendChild(codeBtn);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    card.appendChild(actions);

    grid.appendChild(card);
  });
}

// ====== Modal ======
function openModal(project) {
  const modal = $("#projectModal");
  if (!modal) return;

  $("#modalTitle").textContent = project.title;
  $("#modalDesc").textContent = project.details || project.desc || "";

  const tags = $("#modalTags");
  tags.innerHTML = "";
  (project.tags || []).forEach((t) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = t;
    tags.appendChild(span);
  });

  const live = $("#modalLive");
  const code = $("#modalCode");

  live.href = project.live || "#";
  code.href = project.code || "#";

  // If links are placeholders, disable visually by pointing to #
  live.style.opacity = project.live && project.live !== "#" ? "1" : "0.55";
  code.style.opacity = project.code && project.code !== "#" ? "1" : "0.55";

  modal.showModal();
}

function initModal() {
  const modal = $("#projectModal");
  const closeBtn = $("#modalClose");
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", () => modal.close());

  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const clickedInDialog =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!clickedInDialog) modal.close();
  });
}

// ====== Experience timeline ======
function renderTimeline() {
  const wrap = $("#timeline");
  if (!wrap) return;

  wrap.innerHTML = "";
  EXPERIENCE.forEach((x) => {
    const item = document.createElement("div");
    item.className = "item";

    const top = document.createElement("div");
    top.className = "item__top";

    const left = document.createElement("div");
    const role = document.createElement("h3");
    role.className = "item__role";
    role.textContent = x.role;

    const company = document.createElement("p");
    company.className = "item__company";
    company.textContent = x.company;

    left.appendChild(role);
    left.appendChild(company);

    const time = document.createElement("div");
    time.className = "item__time";
    time.textContent = x.time;

    top.appendChild(left);
    top.appendChild(time);

    const ul = document.createElement("ul");
    ul.className = "item__points";
    (x.points || []).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      ul.appendChild(li);
    });

    item.appendChild(top);
    item.appendChild(ul);

    wrap.appendChild(item);
  });
}

// ====== Contact form (mailto) ======
function initContactForm() {
  const form = $("#contactForm");
  const hint = $("#formHint");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const msg = String(data.get("message") || "").trim();

    if (!name || !email || !msg) {
      if (hint) {
        hint.textContent = "Please fill all fields.";
        hint.style.color = "var(--danger)";
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio Contact — ${name}`);
    const body = encodeURIComponent(
      `Hi ${PROFILE.fullName},\n\n${msg}\n\nFrom: ${name}\nEmail: ${email}\n`
    );

    const mailto = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;

    if (hint) {
      hint.textContent = "Opening your email app…";
      hint.style.color = "var(--muted)";
    }
  });
}

// ====== Reveal on scroll ======
function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach((el) => el.classList.add("reveal--on"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("reveal--on");
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

// ====== Scroll progress ======
function initProgress() {
  const bar = $("#progress");
  if (!bar) return;

  const onScroll = () => {
    const h = document.documentElement;
    const st = h.scrollTop || document.body.scrollTop;
    const sh = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    const p = sh > 0 ? (st / sh) * 100 : 0;
    bar.style.width = `${p}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ====== Init ======
function initBasics() {
  $("#year").textContent = new Date().getFullYear();

  // Update links from PROFILE
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) emailLink.href = `mailto:${PROFILE.email}`;

  // Set resume file
  const resumeBtn = $("#resumeBtn");
  if (resumeBtn) {
    resumeBtn.href = PROFILE.resumeFile || "#";
    if (!PROFILE.resumeFile || PROFILE.resumeFile === "#") {
      resumeBtn.classList.add("btn--ghost");
      resumeBtn.textContent = "Resume (add resume.pdf)";
      resumeBtn.removeAttribute("download");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBasics();

  $("#themeToggle").addEventListener("click", () => {
    const curr = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(curr === "dark" ? "light" : "dark");
  });

  initMobileMenu();
  initReveal();
  initProgress();

  renderSkills();

  const cats = uniqueCategories(PROJECTS);
  renderFilters(cats);
  renderProjects("All");
  initModal();

  renderTimeline();
  initContactForm();
});
