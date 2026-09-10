const root = document.documentElement;
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuLinks = mobileMenu?.querySelectorAll("a") ?? [];
const profileZoom = document.querySelector("[data-profile-zoom]");
const profileLightbox = document.querySelector("[data-profile-lightbox]");
const profileClose = document.querySelector("[data-profile-close]");


function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // The theme still works for this visit when storage is unavailable.
  }
}

function updateThemeControls(theme) {
  const isDark = theme === "dark";
  const labelKey = isDark
    ? "accessibility.themeLight"
    : "accessibility.themeDark";
  const nextThemeLabel = window.i18n?.t(labelKey) ??
    (isDark ? "Switch to light mode" : "Switch to dark mode");

  themeToggles.forEach((toggle) => {
    toggle.setAttribute("aria-label", nextThemeLabel);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.title = nextThemeLabel;
  });

  themeColor?.setAttribute("content", isDark ? "#0f1115" : "#ffffff");
}

function setTheme(theme, persist = false) {
  root.dataset.theme = theme;
  updateThemeControls(theme);

  if (persist) {
    saveTheme(theme);
  }
}

function setMenu(open) {
  mobileMenu?.classList.toggle("open", open);
  menuToggle?.classList.toggle("open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));

  const labelKey = open
    ? "accessibility.closeMenu"
    : "accessibility.openMenu";
  menuToggle?.setAttribute(
    "aria-label",
    window.i18n?.t(labelKey) ?? (open ? "Close navigation menu" : "Open navigation menu")
  );
}

themeToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme, true);
  });
});

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

profileZoom?.addEventListener("click", () => {
  profileLightbox?.showModal();
});

profileClose?.addEventListener("click", () => {
  profileLightbox?.close();
});

profileLightbox?.addEventListener("click", (event) => {
  if (event.target === profileLightbox) {
    profileLightbox.close();
  }
});

profileLightbox?.addEventListener("close", () => {
  profileZoom?.focus();
});

setTheme(root.dataset.theme || "light");

document.addEventListener("languagechange", () => {
  updateThemeControls(root.dataset.theme);
  setMenu(menuToggle?.getAttribute("aria-expanded") === "true");
});

setMenu(false);

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}
