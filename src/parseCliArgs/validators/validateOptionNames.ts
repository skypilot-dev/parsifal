import { filterDuplicates } from '~src/lib/functions/array/filterDuplicates.ts';
import type { ArgumentDefinition, ValidationException } from '~src/parseCliArgs/_types/index.ts';
import { toOptionName } from '~src/parseCliArgs/formatters/toOptionName.ts';

export function validateOptionNames(
  positionalArgDefs: ArgumentDefinition[],
): ValidationException[] {
  const optionNames = positionalArgDefs
    .map((positionalArgDef, i) => toOptionName(positionalArgDef, i));

  const duplicateNames = filterDuplicates(optionNames);

  if (duplicateNames.length) {
    return [{
      level: 'error',
      message: "Invalid definitions: Option names cannot conflict with indices when 'useIndicesAsOptionName: true'",
      identifiers: duplicateNames,
    }];
  }
  return [];
}
