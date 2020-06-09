import { filterDuplicates } from '../../lib/functions/array/filterDuplicates';
import { ArgumentDefinition, ValidationException } from '../_types';
import { toOptionName } from '../formatters/toOptionName';

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
