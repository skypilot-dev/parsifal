import { ArgumentDefinition, ValidationException } from '../../_types';
import { disallowDefaultWithRequired } from '../disallowDefaultWithRequired';


describe('disallowDefaultWithRequired()', () => {
  it('should return no exceptions when `required: true` is never combined with `defaultValue`', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'option1', defaultValue: 1 },
      { name: 'option2', required: true },
    ];

    const exceptions = disallowDefaultWithRequired(argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('should return an exception when an arg def specifies both `required: true` and a default value', () => {
    const argDefs: ArgumentDefinition[] = [{
      defaultValue: 1,
      name: 'option',
      required: true,
    }];

    const exceptions = disallowDefaultWithRequired(argDefs);

    const expected = [
      {
        code: 'badDefinition',
        level: 'error',
        message: 'Invalid definition: An option cannot be required and have a default value',
        identifiers: ['option'],
      },
    ];
    expect(exceptions).toStrictEqual(expected);
  });
});
