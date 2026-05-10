const GENRE_LABELS: Record<string, string> = {
  sf: 'SF',
  fantasy: 'ファンタジー',
  mystery: 'ミステリー',
  horror: 'ホラー',
  romance: 'ロマンス',
  other: 'その他',
}

export function genreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre.toUpperCase()
}
