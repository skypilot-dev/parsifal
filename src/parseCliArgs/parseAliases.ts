import type { NamedArgumentDef } from '~src/parseCliArgs/_types/index.ts';

interface AliasMap {
  [key: string]: string;
}

/* Given an array of name & aliases definitions, return a map of all the aliases and the names
 * the names they reference. */
export function parseAliases(namedArgDefs: NamedArgumentDef[]): AliasMap {
  const aliasMap = namedArgDefs.reduce((allAliases, def) => {
    const { aliases = [], name } = def;
    const argAliases = Object.fromEntries(aliases.map(
      ( alias) => [alias, name],
    ));
    return {
      ...allAliases,
      ...argAliases,
    };
  }, {});
  return aliasMap;
}
