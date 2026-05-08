export function toSameOriginUrl(value: unknown, origin: string, fallback = '/'): string {
  if (typeof value !== 'string' || !value) return fallback

  try {
    const url = new URL(value, origin)
    if (url.origin !== origin) return fallback
    return url.toString()
  } catch {
    return fallback
  }
}
