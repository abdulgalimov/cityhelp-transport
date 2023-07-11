export function encodeHiddenLink() {}

export function htmlEncode(text: string): string {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
