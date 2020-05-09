import { RequireProps } from '@skypilot/common-types';

type Validator = (arg: string) => boolean;

export type ArgumentDef = {
  aliases?: string[];
  defaultValue?: string | number;
  name?: string;
  positional?: boolean;
  required?: boolean;
  validator?: Validator;
  validValues?: string[];
  valueLabel?: string;
  valueType?: 'boolean' | 'string' | 'number';
}

export interface ArgumentMap {
  [key: string]: ArgumentValue;
}

export type ArgumentValue = LiteralValue | LiteralValue[] | undefined

type LiteralValue = boolean | number | string;


export interface NamedArgumentDef extends RequireProps<ArgumentDef, 'name'> {
  positional?: false;
}

export interface PositionalArgumentDef extends ArgumentDef {
  positional?: true;
}
