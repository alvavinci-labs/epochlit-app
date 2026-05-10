type GtagParams = Record<string, string>
type Gtag = (command: string, action: string, params?: GtagParams) => void

declare global {
  interface Window {
    gtag?: Gtag
  }
}

export function trackEvent(action: string, params?: GtagParams): void {
  window.gtag?.('event', action, params)
}
