import { NamedArgumentDef, PositionalArgumentDef } from './_types/types';

type ArgumentMap = {
  [key: string]: any;
};

export function validateArgs(
  argDefs: Array<NamedArgumentDef | PositionalArgumentDef>,
  argMap: ArgumentMap,
  checkNames = false
): void | never {
  /* Check whether any required args are missing. */
  argDefs.forEach((argDef, index) => {
    const { name = `ARG${index + 1}`, required } = argDef;
    if (required && !Object.prototype.hasOwnProperty.call(argMap, name)) {
      throw new Error(`A value for ${name} is required`);
    }
  });
  /* Check whether any args are unnamed. */
  if (checkNames) {
    const unknownNames: string[] = [];
    Object.keys(argMap).forEach((key) => {
      if (!argDefs.find(({ name }) => name === key)) {
        unknownNames.push(key);
      }
    });
    if (unknownNames.length > 0) {
      throw new Error(`Unknown options: ${unknownNames.join(' ')}`);
    }
  }
}
