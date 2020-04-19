type KeyValues = {
  [key: string]: boolean | number | string;
}

type AliasMap = {
  [key: string]: string;
}

/* Given an object and an alias map, omit from the object all entries whose keys are aliases
 * defined in the alias map and return the result. */
export function omitAliases(keyValues: KeyValues, map: AliasMap): KeyValues {
  const aliases = Object.keys(map);
  return Object.entries(keyValues).reduce((noAliases, entry) => {
    const [key, value] = entry;
    if (aliases.includes(key)) {
      return noAliases;
    }
    return {
      ...noAliases,
      [key]: value,
    };
  }, {});
}
