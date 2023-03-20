export function generateColorStr(colors: Array<any>, index: number) {
  const round = Math.floor(index / colors.length)
  const indexInLength = index % colors.length
  return `rgba(${colors[indexInLength].join(" ")} / ${(1 - (round % 3) / 4).toFixed(1)})`
}
