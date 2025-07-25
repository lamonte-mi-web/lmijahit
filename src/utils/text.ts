export function truncate(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  //util
  return text.slice(0, length) + "...";
}