import { RequireProps } from '@skypilot/common-types';

type Validator = (arg: string) => boolean;

export interface Argument {
  definition: ArgumentDefinition;
  value: ArgumentValue;
}

export interface ArgumentDefV1 {
  aliases?: string[];
  defaultValue?: ArgumentValue;
  name?: string;
  positional?: boolean;
  required?: boolean;
  validator?: Validator;
  validValues?: ArgumentValue[];
  valueLabel?: string;
  valueType?: ValueType;
}

export type ArgumentDefinition = RequireProps<ArgumentDefV1, 'name'>

export type ArgumentInput = ArgumentDefinition | string;

export interface ArgumentsMap {
  [key: string]: ArgumentValue;
}

export type ArgumentValue = LiteralValue | undefined

export interface InitialParsedArgs {
  [key: string]: ArgumentValue | ArgumentValue[];
  _: ArgumentValue[];
  '--': ArgumentValue[];
}

type LiteralValue = boolean | number | string;

export interface NamedArgumentDef extends RequireProps<ArgumentDefV1, 'name'> {
  positional?: false;
}

export type NamedArgDefInput = NamedArgumentDef | string;

export interface PositionalArgumentDef extends ArgumentDefV1 {
  positional?: true;
}

export type PositionalArgDefInput = PositionalArgumentDef | string;

export interface ValidationException {
  code?: 'badDefinition' | 'missing' | 'unlistedValue' | 'wrongType';
  level?: 'warning' | 'error';
  message: string;
  identifiers: string[];
}

export type ValueType = 'boolean' | 'integer' | 'string' | 'number';
