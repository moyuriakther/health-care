const pick = <T extends Record<string, unknown>, K extends keyof T>(
  queries: T,
  keys: K[]
): Partial<T> => {
  const finalQuery: Partial<T> = {};
  // console.log(queries, keys);
  for (const key of keys) {
    if (queries && Object.hasOwnProperty.call(queries, key)) {
      finalQuery[key] = queries[key];
    }
  }
  return finalQuery;
};
export default pick;
