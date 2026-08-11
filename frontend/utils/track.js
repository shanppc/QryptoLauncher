/**
 * Pushes a custom event to the GTM dataLayer.
 * Safe to call server-side (no-ops if window is unavailable).
 *
 * @param {string} eventName - The GA4/GTM event name.
 * @param {Record<string, any>} params - Additional event parameters.
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
}
