export function storyHref(genre: string, hashId: string): string {
  return `/${encodeURIComponent(genre)}/${encodeURIComponent(hashId)}`
}
