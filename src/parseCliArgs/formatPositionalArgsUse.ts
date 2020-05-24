import { ArgumentDefinition } from './_types';
import { formatValueLabel } from './formatValueLabel';

export function formatPositionalArgsUse(argDefs: ArgumentDefinition[]): string {
  const requiredArgDefs = argDefs.filter(({ required }) => !!required);
  const optionalArgDefs = argDefs.filter(({ required }) => !required);

  const requiredArgUsage = requiredArgDefs.length
    ? requiredArgDefs.map(({ name }) => `<${name}>`).join(' ')
    : '';

  const optionalArgUsage = optionalArgDefs.length
    ? `[${optionalArgDefs.map((argDef) => formatValueLabel(argDef)).join(' ')}]`
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
