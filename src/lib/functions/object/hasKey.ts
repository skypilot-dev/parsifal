export function hasKey (obj, keys) {
  let o = obj;
  keys.slice(0, -1).forEach(function (key) {
    o = (o[key] || {});
  });

  const key = keys[keys.length - 1];
  return key in o;
}
