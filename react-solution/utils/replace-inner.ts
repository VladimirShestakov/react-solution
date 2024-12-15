export function replaceInner(text: string, start: RegExp, end: RegExp, newInner: string): string {
  const matchStart = text.match(start);
  const matchEnd = text.match(end);

  if (matchStart && matchEnd) {
    const startIndex = text.indexOf(matchStart[0]);
    const endIndex = text.indexOf(matchEnd[0]);
    return text.substring(0, startIndex + matchEnd[0].length) + newInner + text.substring(endIndex);
  }

  return text;
}
