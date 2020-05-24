import { ArgumentDefinition } from './_types';

export function formatPositionalArgsUse(argDefs: ArgumentDefinition[]): string {
  const requiredArgDefs = argDefs.filter(({ required }) => !!required);
  const optionalArgDefs = argDefs.filter(({ required }) => !required);

  const requiredArgUsage = requiredArgDefs.length
    ? requiredArgDefs.map(({ name }) => `<${name}>`).join(' ')
    : '';

  const optionalArgUsage = optionalArgDefs.length
    ? `[${optionalArgDefs.map(({ name }) => `<${name}>`).join(' ')}]`
    : '';

  const argUsage: string[] = [];
  if (requiredArgUsage) {
    argUsage.push(requiredArgUsage);
  }
  if (optionalArgUsage) {
    argUsage.push(optionalArgUsage);
  }
  return argUsage.join(' ');
}
