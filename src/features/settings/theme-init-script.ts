;(() => {
  try {
    const storageKey = "kort-og-lang-theme"
    const savedTheme = localStorage.getItem(storageKey) || "system"
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    const resolvedTheme =
      savedTheme === "system"
        ? systemPrefersDark
          ? "dark"
          : "light"
        : savedTheme

    const root = document.documentElement
    root.classList.toggle("dark", resolvedTheme === "dark")
    root.style.colorScheme = resolvedTheme
  } catch (_error) {
    // Ignore storage and media-query access failures during bootstrap.
  }
})()
