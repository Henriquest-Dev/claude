/** Nav colour follows the background underneath it. */
export function setTheme(theme: "light" | "dark"): void {
  if (document.body.dataset.theme !== theme) document.body.dataset.theme = theme;
}
