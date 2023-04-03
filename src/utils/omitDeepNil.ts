import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

function isNil(val: unknown): boolean {
  return val === undefined || val === null;
}

export default function omitDeepNil<T = unknown>(obj: T): T {
  if (isObject(obj) && !isArray(obj)) {
    const realObj = obj as Record<string, unknown>;

    return Object.keys(realObj).reduce((pV, key) => {
      const value = realObj[key];
      return isNil(value) ? pV : { ...pV, [key]: value };
    }, {}) as T;
  }

  return obj;
}
