const charMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

export function htmlEscape(text: string) {
  return text?.replace(/[&<>"']/g, (match: string) => {
    return charMap[match] || match;
  });
}
