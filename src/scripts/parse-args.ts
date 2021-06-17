import { parseCliArgs } from '../parseCliArgs';

const parsedArgs = parseCliArgs({
  named: [
    {
      name: 'sourceName',
      valueType: 'string',
      required: true,
      validValues: ['graphqlapi', 'restapi', 'database'],
    },
    {
      name: 'pageRange',
      valueType: 'integerArray',
      valueLabel: 'numbers of the first and last pages to fetch',
    },
    {
      name: 'refetch',
      valueType: 'boolean',
      defaultValue: false,
      valueLabel: 'fetch even if the record is already in the database',
    },
    {
      name: 'slice',
      valueType: 'integerArray',
      valueLabel: 'slice to apply to the list of records to fetch',
    },
    {
      name: 'verbose',
      valueType: 'boolean',
      defaultValue: true,
      valueLabel: 'display console messages during the request run',
    },
    {
      name: 'localeCode',
      valueType: 'string',
      valueLabel: 'locale code to pass to the request',
    },
    // Database options
    {
      name: 'noBackup',
      valueType: 'boolean',
      defaultValue: false,
      valueLabel: 'do not back up the database when starting a request run',
    },
    {
      name: 'wipeData',
      valueType: 'boolean',
      defaultValue: false,
      valueLabel: 'wipe the database when starting the run',
    },
    // Browser options
    {
      name: 'delayInMs',
      valueType: 'integer',
      defaultValue: 100,
      valueLabel: 'delay between requests',
    },
    {
      name: 'variableDelayInMs',
      valueType: 'integer',
      defaultValue: 100,
      valueLabel: 'additional variable delay (from 1 to entered range) between requests',
    },
  ],
  positional: [
    { name: 'file1' },
    { name: 'file2' },
  ],
}, { echo: { echoIf: argsMap => argsMap.get('verbose') } });

console.log('parsedArgs:', parsedArgs);
