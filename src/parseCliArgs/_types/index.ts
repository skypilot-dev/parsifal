import { RequireProps } from '@skypilot/common-types';

type Validator = (arg: string) => boolean;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ArgumentDef<T = any> = {
  aliases?: string[];
  defaultValue?: string | number;
  name?: string;
  positional?: boolean;
  required?: boolean;
  validator?: Validator;
  validValues?: T[];
  valueLabel?: string;
  valueType?: 'boolean' | 'string' | 'number';
}

export interface ArgumentsMap {
  [key: string]: ArgumentValue;
}

export type ArgumentValue = LiteralValue | LiteralValue[] | undefined

type LiteralValue = boolean | number | string;


export interface NamedArgumentDef extends RequireProps<ArgumentDef, 'name'> {
  positional?: false;
}

export type NamedArgDefInput = NamedArgumentDef | string;

export interface PositionalArgumentDef extends ArgumentDef {
  positional?: true;
}

export type PositionalArgDefInput = PositionalArgumentDef | string;

export interface ValidationException {
  level?: 'warning' | 'error';
  message: string;
  identifiers: string[];
}
