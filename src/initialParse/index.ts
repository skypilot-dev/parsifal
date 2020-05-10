/* eslint-disable  */
// @ts-nocheck

import { hasKey } from 'src/lib/functions/object/hasKey';
import { isNumber } from 'src/lib/functions/number/isNumber';

interface Flags {
  allBooleans: boolean;
  bools: object;
  strings: object;
  unknownFn: Function | null;
}

interface Options {
  '--'?: boolean;
  alias?: object;
  boolean?: boolean | string | string[];
  default?: object;
  unknown?: Function | null;
}

export function initialParse(args: string[], options: Options = {}): any {
  const { boolean: booleanOpt, unknown: unknownFn = null } = options;

  let allBooleans = false;
  let booleanKeys: { [key: string]: boolean } = {};
  if (typeof booleanOpt === 'boolean') {
    allBooleans = booleanOpt;
  } else if (typeof booleanOpt === 'string') {
    booleanKeys = { [booleanOpt]: true };
  } else if (Array.isArray(booleanOpt)) {
    booleanKeys = booleanOpt.filter(Boolean).reduce((accKeys, key: string) => ({
      ...accKeys,
      [key]: true,
    }), {} as { [key: string]: boolean });
  }
  const flags: Flags = {
    allBooleans,
    bools: booleanKeys,
    strings: {},
    unknownFn,
  };

  if (typeof options['unknown'] === 'function') {
    flags.unknownFn = options['unknown'];
  }

  const aliases = {};
  Object.keys(options.alias || {}).forEach(function (key) {
    aliases[key] = [].concat(options.alias[key]);
    aliases[key].forEach((x) => {
      aliases[x] = [key].concat(aliases[key].filter(function (y) {
        return x !== y;
      }));
    });
  });

  [].concat(options.string).filter(Boolean).forEach(function (key) {
    flags.strings[key] = true;
    if (aliases[key]) {
      flags.strings[aliases[key]] = true;
    }
  });

  const defaults = options['default'] || {};

  const argv = { _ : [] };
  Object.keys(flags.bools).forEach(function (key) {
    setArg(key, defaults[key] === undefined ? false : defaults[key]);
  });

  let notFlags = [];

  if (args.indexOf('--') !== -1) {
    notFlags = args.slice(args.indexOf('--')+1);
    args = args.slice(0, args.indexOf('--'));
  }

  function argDefined(key, arg) {
    return (flags.allBooleans && /^--[^=]+$/.test(arg)) ||
      flags.strings[key] || flags.bools[key] || aliases[key];
  }

  function setArg (key, val, arg) {
    if (arg && flags.unknownFn && !argDefined(key, arg)) {
      if (flags.unknownFn(arg) === false) return;
    }

    const value = !flags.strings[key] && isNumber(val)
      ? Number(val) : val
    ;
    setKey(argv, key.split('.'), value);

    (aliases[key] || []).forEach(function (x) {
      setKey(argv, x.split('.'), value);
    });
  }

  function setKey (obj, keys, value) {
    var o = obj;
    for (var i = 0; i < keys.length-1; i++) {
      var key = keys[i];
      if (key === '__proto__') return;
      if (o[key] === undefined) o[key] = {};
      if (o[key] === Object.prototype || o[key] === Number.prototype
        || o[key] === String.prototype) o[key] = {};
      if (o[key] === Array.prototype) o[key] = [];
      o = o[key];
    }

    var key = keys[keys.length - 1];
    if (key === '__proto__') return;
    if (o === Object.prototype || o === Number.prototype
      || o === String.prototype) o = {};
    if (o === Array.prototype) o = [];
    if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
      o[key] = value;
    }
    else if (Array.isArray(o[key])) {
      o[key].push(value);
    }
    else {
      o[key] = [ o[key], value ];
    }
  }

  function aliasIsBoolean(key) {
    return aliases[key].some(function (x) {
      return flags.bools[x];
    });
  }

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];

    if (/^--.+=/.test(arg)) {
      // Using [\s\S] instead of . because js doesn't support the
      // 'dotall' regex modifier. See:
      // http://stackoverflow.com/a/1068308/13216
      var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
      var key = m[1];
      let value = m[2];
      if (flags.bools[key]) {
        value = value !== 'false';
      }
      setArg(key, value, arg);
    }
    else if (/^--no-.+/.test(arg)) {
      var key = arg.match(/^--no-(.+)/)[1];
      setArg(key, false, arg);
    }
    else if (/^--.+/.test(arg)) {
      var key = arg.match(/^--(.+)/)[1];
      var next = args[i + 1];
      if (next !== undefined && !/^-/.test(next)
        && !flags.bools[key]
        && !flags.allBooleans
        && (aliases[key] ? !aliasIsBoolean(key) : true)) {
        setArg(key, next, arg);
        i++;
      }
      else if (/^(true|false)$/.test(next)) {
        setArg(key, next === 'true', arg);
        i++;
      }
      else {
        setArg(key, flags.strings[key] ? '' : true, arg);
      }
    }
    else if (/^-[^-]+/.test(arg)) {
      var letters = arg.slice(1,-1).split('');

      var broken = false;
      for (var j = 0; j < letters.length; j++) {
        var next = arg.slice(j+2);

        if (next === '-') {
          setArg(letters[j], next, arg)
          continue;
        }

        if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
          setArg(letters[j], next.split('=')[1], arg);
          broken = true;
          break;
        }

        if (/[A-Za-z]/.test(letters[j])
          && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
          setArg(letters[j], next, arg);
          broken = true;
          break;
        }

        if (letters[j+1] && letters[j+1].match(/\W/)) {
          setArg(letters[j], arg.slice(j+2), arg);
          broken = true;
          break;
        }
        else {
          setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
        }
      }

      var key = arg.slice(-1)[0];
      if (!broken && key !== '-') {
        if (args[i+1] && !/^(-|--)[^-]/.test(args[i+1])
          && !flags.bools[key]
          && (aliases[key] ? !aliasIsBoolean(key) : true)) {
          setArg(key, args[i+1], arg);
          i++;
        }
        else if (args[i+1] && /^(true|false)$/.test(args[i+1])) {
          setArg(key, args[i+1] === 'true', arg);
          i++;
        }
        else {
          setArg(key, flags.strings[key] ? '' : true, arg);
        }
      }
    }
    else {
      if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
        argv._.push(
          flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
        );
      }
      if (options.stopEarly) {
        argv._.push.apply(argv._, args.slice(i + 1));
        break;
      }
    }
  }

  Object.keys(defaults).forEach(function (key) {
    if (!hasKey(argv, key.split('.'))) {
      setKey(argv, key.split('.'), defaults[key]);

      (aliases[key] || []).forEach(function (x) {
        setKey(argv, x.split('.'), defaults[key]);
      });
    }
  });

  if (options['--']) {
    argv['--'] = [];
    notFlags.forEach(function(key) {
      argv['--'].push(key);
    });
  }
  else {
    notFlags.forEach(function(key) {
      argv._.push(key);
    });
  }

  return argv;
}
