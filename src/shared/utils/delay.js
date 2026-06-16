export function delay(ms = 650) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
