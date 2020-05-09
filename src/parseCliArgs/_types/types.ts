import { RequireProps } from '@skypilot/common-types';

type Validator = (arg: string) => boolean;

export type ArgumentDef = {
  aliases?: string[];
  defaultValue?: string | number;
  isPositional?: boolean;
  name?: string;
  required?: boolean;
  validator?: Validator;
  validValues?: string[];
  valueLabel?: string;
  valueType?: 'boolean' | 'string' | 'number';
}

export type NamedArgumentDef = RequireProps<ArgumentDef, 'name'>

export type PositionalArgumentDef = ArgumentDef
