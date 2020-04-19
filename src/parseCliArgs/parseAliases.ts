import { NamedArgumentDef } from './_types/types';

type AliasMap = {
  [key: string]: string;
}

/* Given an array of name & aliases definitions, return a map of all the aliases and the names
 * the names they reference. */
export function parseAliases(namedArgDefs: NamedArgumentDef[]): AliasMap {
  const aliasMap = namedArgDefs.reduce((allAliases, def) => {
    const { aliases = [], name } = def;
    const argAliases = aliases.reduce((argAliases, alias) => ({
      ...argAliases,
      [alias]: name,
    }), {});
    return {
      ...allAliases,
      ...argAliases,
    }
  }, {});
  return aliasMap;
}
