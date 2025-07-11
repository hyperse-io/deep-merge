/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 * @param item - The item to check.
 * @returns True if the item is an object, false otherwise.
 */
export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * @description
 * Checks if the item is an object and has a constructor.
 * @param item - The item to check.
 * @returns True if the item is an object and has a constructor, false otherwise.
 */
export function isClassInstance(item: any): boolean {
  // Even if item is an object, it might not have a constructor as in the
  // case when it is a null-prototype object, i.e. created using `Object.create(null)`.
  return (
    isObject(item) && item.constructor && item.constructor.name !== 'Object'
  );
}

/**
 * An extremely fast function for deep-cloning an object which only contains simple
 * values, i.e. primitives, arrays and nested simple objects.
 * @param input - The input to clone.
 * @returns The cloned input.
 */
export function simpleDeepClone<T extends string | number | any[] | object>(
  input: T
): T {
  // if not array or object or is null return self
  if (typeof input !== 'object' || input === null) {
    return input;
  }
  let output: any;
  let i: number | string;
  // handle case: array
  if (Array.isArray(input)) {
    let l;
    output = [] as any[];
    for (i = 0, l = input.length; i < l; i++) {
      output[i] = simpleDeepClone(input[i]);
    }
    return output;
  }
  if (isClassInstance(input)) {
    return input;
  }
  // handle case: object
  output = {};
  for (i in input) {
    if (Object.prototype.hasOwnProperty.call(input, i)) {
      output[i] = simpleDeepClone((input as any)[i]);
    }
  }
  return output;
}
