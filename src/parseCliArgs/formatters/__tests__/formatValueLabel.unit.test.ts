import { ArgumentDefinition } from '../../_types';
import { formatValueLabel } from '../formatValueLabel';

describe('formatValueLabel', () => {
  it('given a value label, should return the label enclosed in angle brackets', () => {
    const argDef: ArgumentDefinition = {
      name: 'option',
      valueLabel: 'value label',
    };

    const valueLabel = formatValueLabel(argDef);

    const expected = '<value label>';
    expect(valueLabel).toBe(expected);
  });

  it('given no valueLabel but a non-empty array of validValues, should return the valid values', () => {
    const argDef: ArgumentDefinition = {
      name: 'option',
      validValues: ['1', '2'],
    };

    const valueLabel = formatValueLabel(argDef);

    const expected = '1|2';
    expect(valueLabel).toBe(expected);
  });

  it('given neither valueLabel nor validValues but given valueType, should use valueType', () => {
    const argDef: ArgumentDefinition = {
      name: 'option',
      validValues: [],
      valueType: 'integer',
    };

    const valueLabel = formatValueLabel(argDef);

    const expected = '<integer>';
    expect(valueLabel).toBe(expected);
  });

  it('for a positional argument, given neither valueLabel, validValues, nor valueType, should use the argument name', () => {
    const argDef: ArgumentDefinition = {
      name: 'option',
      positional: true,
      validValues: [],
    };

    const valueLabel = formatValueLabel(argDef);

    const expected = '<option>';
    expect(valueLabel).toBe(expected);
  });

  it("for a named argument, given neither valueLabel, validValues, nor valueType, should use 'value'", () => {
    const argDef: ArgumentDefinition = {
      name: 'option',
      positional: false,
      validValues: [],
    };

    const valueLabel = formatValueLabel(argDef);

    const expected = '<value>';
    expect(valueLabel).toBe(expected);
  });

});
