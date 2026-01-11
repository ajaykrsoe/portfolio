// script.js
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");

navToggle?.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

navList?.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.classList && target.classList.contains("nav__link")) {
    navList.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Theme toggle (stored in localStorage)
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function setTheme(mode) {
  if (mode === "light") {
    root.setAttribute("data-theme", "light");
    themeToggle.textContent = "☀️";
  } else {
    root.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("theme", mode);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

// Reveal on scroll
const revealEls = document.querySelectorAll(".card, .section__head, .strip, .note");
revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Active nav link while scrolling
const sections = ["about","skills","projects","tutoring","experience","certifications","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = Array.from(document.querySelectorAll(".nav__link"));

function setActiveLink() {
  const y = window.scrollY + 120;
  let currentId = "";
  for (const sec of sections) {
    if (sec.offsetTop <= y) currentId = sec.id;
  }
  navLinks.forEach(a => {
    const href = a.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    a.classList.toggle("active", id && id === currentId);
  });
}
window.addEventListener("scroll", setActiveLink);
setActiveLink();

// Scroll progress bar
const progress = document.getElementById("progress");
function updateProgress() {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progress.style.width = `${p}%`;
}
window.addEventListener("scroll", updateProgress);
updateProgress();

// Contact form: WhatsApp validation + success message
const contactForm = document.querySelector('form[name="contact"]');
const whatsappCode = document.getElementById("whatsappCode");
const whatsappNumber = document.getElementById("whatsappNumber");
const whatsappFull = document.getElementById("whatsappFull");

function normalizePhone(value) {
  return value.replace(/\D/g, "");
}

function validateWhatsapp() {
  if (!whatsappNumber) return true;
  const digits = normalizePhone(whatsappNumber.value);
  if (digits !== whatsappNumber.value) {
    whatsappNumber.value = digits;
  }
  if (!digits) {
    whatsappNumber.setCustomValidity("Please enter your WhatsApp number.");
    return false;
  }
  if (digits.length < 7 || digits.length > 15) {
    whatsappNumber.setCustomValidity("Please enter a valid WhatsApp number (7-15 digits).");
    return false;
  }
  whatsappNumber.setCustomValidity("");
  return true;
}

whatsappNumber?.addEventListener("input", validateWhatsapp);

contactForm?.addEventListener("submit", (e) => {
  const isValidPhone = validateWhatsapp();
  const isValidForm = contactForm.reportValidity();
  if (!isValidPhone || !isValidForm) {
    e.preventDefault();
    return;
  }
  if (whatsappFull && whatsappCode && whatsappNumber) {
    whatsappFull.value = `${whatsappCode.value}${normalizePhone(whatsappNumber.value)}`;
  }
  alert("Message has been sent successfully");
});
