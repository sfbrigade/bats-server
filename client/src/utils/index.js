export function isValueEmpty(value) {
  const valueType = typeof value;
  // count 0 and false as non-empty values
  return valueType !== 'number' && valueType !== 'boolean' && !value;
}
