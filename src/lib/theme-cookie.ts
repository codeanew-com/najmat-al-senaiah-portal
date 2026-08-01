export const THEME_COOKIE = "theme";

export function setThemeCookie(theme: "light" | "dark") {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
