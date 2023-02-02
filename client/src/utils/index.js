// eslint-disable-next-line import/prefer-default-export
export function isValueEmpty(value) {
  const valueType = typeof value;
  console.log(`valueType !== 'number' && valueType !== 'boolean' && !value`, valueType !== 'number' && valueType !== 'boolean' && !value);
  // count 0 and false as non-empty values
  return valueType !== 'number' && valueType !== 'boolean' && !value;
}
