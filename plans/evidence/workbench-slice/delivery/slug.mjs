// Deliberately incomplete starting point for the isolated construction slice.
export function slug(value) {
  if (typeof value !== 'string') {
    throw new TypeError('slug requires a string');
  }
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
