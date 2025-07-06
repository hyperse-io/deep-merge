import {
  isClassInstance,
  isObject,
  simpleDeepClone,
} from './simpleDeepClone.js';
import type { DeepPartial } from './types.js';

/**
 * @description
 * Checks if the source is undefined and mergeUndefined is false.
 * @param source - The source object to check.
 * @param mergeUndefined - Whether to merge undefined values.
 * @returns True if the source is undefined and mergeUndefined is false, false otherwise.
 */
const needMerge = (source: any, mergeUndefined?: boolean) => {
  return !(typeof source === 'undefined' && !mergeUndefined);
};

/**
 * @description
 * Performs a deep merge of two Plugin options merge objects. Unlike `Object.assign()` the `target` object is
 * not mutated, instead the function returns a new object which is the result of deeply merging the
 * values of `source` into `target`.
 *
 * Arrays do not get merged, they are treated as a single value that will be replaced. So if merging the
 * `plugins` array, you must explicitly concatenate the array.
 *
 * @example
 * ```TypeScript
 * const result = mergeOptions(defaultConfig, {
 *   assetOptions: {
 *     uploadMaxFileSize: 5000,
 *   },
 *   plugins: [
 *     ...defaultConfig.plugins,
 *     MyPlugin,
 *   ]
 * };
 * ```
 * @param target - The target object to merge into.
 * @param source - The source object to merge from.
 * @param mergeUndefined - Whether to merge undefined values.
 * @param depth - The depth of the merge.
 */
export function mergeOptions<T>(
  target: T,
  source: DeepPartial<T>,
  mergeUndefined = false,
  depth = 0
): T {
  if (!source) {
    return target;
  }

  if (depth === 0) {
    target = simpleDeepClone(target as any);
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        // `target[key]=true` we also need to assign {} as key
        if (!isObject((target as any)[key])) {
          Object.assign(target, { [key]: {} });
        }
        if (!isClassInstance(source[key])) {
          mergeOptions(
            (target as any)[key],
            (source as any)[key],
            mergeUndefined,
            depth + 1
          );
        } else {
          if (needMerge(source[key], mergeUndefined)) {
            (target as any)[key] = source[key];
          }
        }
      } else {
        if (needMerge(source[key], mergeUndefined)) {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  }
  return target;
}
