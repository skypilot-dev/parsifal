import { filterDuplicates } from '../../lib/functions/array/filterDuplicates';
import { PositionalArgDefInput, ValidationException } from '../_types';
import { toOptionName } from '../toOptionName';

interface ValidateOptionNamesOptions {
  useIndicesAsOptionNames?: boolean;
}

export function validateOptionNames(
  positionalArgDefs: PositionalArgDefInput[],
  options: ValidateOptionNamesOptions = {},
): ValidationException[] {
  const { useIndicesAsOptionNames } = options;
  const optionNames = positionalArgDefs
    .filter((input) => useIndicesAsOptionNames
      || typeof input === 'string'
      || input?.name
    )
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
