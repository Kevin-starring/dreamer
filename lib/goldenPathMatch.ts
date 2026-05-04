export function isGoldenPath(input: string): boolean {
  const normalized = input.toLowerCase().trim()
  return normalized.includes('youtube') && normalized.includes('cook')
}
