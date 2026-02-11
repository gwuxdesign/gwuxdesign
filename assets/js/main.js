(function () {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const storageKey = "theme";

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (toggle) {
      const icon = theme === "dark" ? "☾" : "☀";
      toggle.innerHTML = `<span aria-hidden="true">${icon}</span>`;
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      /* ignore */
    }
  }

  const saved = getSavedTheme();
  const initial = saved || getSystemTheme();
  applyTheme(initial);

  if (toggle) {
    toggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || initial;
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  /* Optional: if user has not chosen a theme, track system changes */
  if (!saved && window.matchMedia) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", function () {
      applyTheme(getSystemTheme());
    });
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
})();
