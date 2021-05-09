import type { RequireProps } from '@skypilot/common-types';

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
  validate?: ValueValidator;
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

export interface EchoOptions {
  // If true, echo parsed values to the console
  echoIf?: boolean | ((argValuesMap: Map<string, ArgumentValue>) => unknown);
  echoUndefined?: boolean;
}

export interface EchoParams {
  echoUndefined: boolean;
  shouldEcho: boolean;
}

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

export type PositionalArgumentDef = ArgumentDefinition & {
  positional?: true;
}

export type PositionalArgDefInput = PositionalArgumentDef | string;

export interface ValidationException {
  code?: 'badDefinition' | 'badValue' | 'missing' | 'unlistedValue' | 'wrongType';
  level?: 'warning' | 'error';
  message: string;
  identifiers: string[];
}

export type ValueType = 'boolean' | 'integer' | 'string' | 'number';

export type ValueValidator<T = any> = (value: T) => boolean | { errors?: string[]; ok: boolean };
