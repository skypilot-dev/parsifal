import type { NamedArgumentDef } from '~src/parseCliArgs/_types/index.ts';

interface AliasMap {
  [key: string]: string;
}

/* Given an array of name & aliases definitions, return a map of all the aliases and the names
 * the names they reference. */
export function parseAliases(namedArgDefs: NamedArgumentDef[]): AliasMap {
  const aliasMap: AliasMap = {};

  for (const def of namedArgDefs) {
    const { aliases = [], name } = def;
    const argAliases = Object.fromEntries(aliases.map((alias) => [alias, name]));

    // Merge the aliases for this definition into the overall alias map
    Object.assign(aliasMap, argAliases);
  }

  return aliasMap;
}
