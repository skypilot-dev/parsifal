interface KeyValues {
  [key: string]: boolean | number | string;
}

interface AliasMap {
  [key: string]: string;
}

/* Given an object and an alias map, omit from the object all entries whose keys are aliases
 * defined in the alias map and return the result. */
export function omitAliases(keyValues: KeyValues, map: AliasMap): KeyValues {
  const aliases = Object.keys(map);
  const result: KeyValues = {};

  for (const [key, value] of Object.entries(keyValues)) {
    if (!aliases.includes(key)) {
      result[key] = value;
    }
  }

  return result;
}
