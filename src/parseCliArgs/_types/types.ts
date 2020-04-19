type Validator = (arg: string) => boolean;

export type ArgumentDef = {
  aliases?: string[];
  defaultValue?: string | number;
  isPositional?: boolean;
  required?: boolean;
  validator?: Validator;
  validValues?: string[];
  valueLabel?: string;
  valueType?: 'boolean' | 'string' | 'number';
}

export interface NamedArgumentDef extends Omit<ArgumentDef, 'name'> {
  name: string;
}

export interface PositionalArgumentDef extends ArgumentDef {
  name?: string;
}
