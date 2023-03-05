export function isNotEmptyString(value: string): boolean {
  return typeof value === 'string' && value.length > 0;
}
