# @hyperse/deep-merge

A TypeScript library for performing deep merges of objects with advanced configuration options. Unlike `Object.assign()`, this library creates new objects without mutating the original target, and provides fine-grained control over how different types of values are merged.

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/deep-merge/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/deep-merge/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/deep-merge">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fdeep-merge?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/deep-merge/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/deep-merge?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/deep-merge/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/deep-merge?style=flat-quare&labelColor=000000" />
  </a>
</p>

## Features

- **Immutable Merging**: Target objects are never mutated; new objects are always returned
- **Deep Recursive Merging**: Nested objects are merged recursively
- **Type Safety**: Full TypeScript support with generic types
- **Class Instance Handling**: Special handling for class instances vs plain objects
- **Array Replacement**: Arrays are treated as single values and replaced (not merged)
- **Undefined Value Control**: Optional merging of undefined values
- **Fast Deep Cloning**: Efficient deep cloning utility for simple objects

## Installation

```bash
npm install @hyperse/deep-merge
# or
yarn add @hyperse/deep-merge
# or
pnpm add @hyperse/deep-merge
```

## API Reference

### `mergeOptions<T>(target: T, source: DeepPartial<T>, mergeUndefined?: boolean, depth?: number): T`

Performs a deep merge of two objects, where the source object's properties are merged into the target object.

#### Parameters

- `target: T` - The target object to merge into
- `source: DeepPartial<T>` - The source object to merge from
- `mergeUndefined?: boolean` - Whether to merge undefined values (default: `false`)
- `depth?: number` - The current depth of the merge (used internally, default: `0`)

#### Returns

- `T` - A new object containing the merged properties

#### Behavior

- **Objects**: Recursively merged if they are plain objects (not class instances)
- **Arrays**: Replaced entirely (not merged)
- **Class Instances**: Replaced entirely (not merged)
- **Primitives**: Replaced by source values
- **Undefined Values**: Only merged if `mergeUndefined` is `true`

### `simpleDeepClone<T>(input: T): T`

An extremely fast function for deep-cloning objects that contain only simple values (primitives, arrays, and nested simple objects).

#### Parameters

- `input: T` - The input to clone

#### Returns

- `T` - The cloned input

#### Behavior

- **Primitives**: Returned as-is
- **Arrays**: Deep cloned recursively
- **Plain Objects**: Deep cloned recursively
- **Class Instances**: Returned as-is (not cloned)
- **Null/Undefined**: Returned as-is

### Utility Functions

#### `isObject(item: any): item is object`

Checks if an item is a plain object (not an array or null).

#### `isClassInstance(item: any): boolean`

Checks if an item is a class instance (has a constructor that's not Object).

### Type Definitions

#### `DeepPartial<T>`

A utility type that makes all properties of `T` optional recursively.

## Usage Examples

### Basic Object Merging

```typescript
import { mergeOptions } from '@hyperse/deep-merge';

const target = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
  hobbies: ['reading', 'swimming'],
};

const source = {
  age: 31,
  address: {
    city: 'Los Angeles',
  },
  hobbies: ['coding'],
};

const result = mergeOptions(target, source);
// Result:
// {
//   name: 'John',
//   age: 31,
//   address: {
//     city: 'Los Angeles',
//     country: 'USA'
//   },
//   hobbies: ['coding']
// }
```

### Plugin Configuration Merging

```typescript
import { mergeOptions } from '@hyperse/deep-merge';

const defaultConfig = {
  dts: true,
  input: { index: 'src/index.ts' },
  logSilent: false,
  modularImports: [],
  plugin: {
    extraPlugins: [],
    pluginConfigs: {
      multiInputOptions: { fastGlobOptions: { ignore: [] } },
      replaceOptions: { 'process.env.NODE_ENV': '"production"' },
      aliasOptions: { entries: [] },
      nodeResolveOptions: {
        extensions: ['.js', '.ts', '.tsx', '.json', '.vue'],
      },
      jsonOptions: {},
      commonjsOptions: {},
      babelOptions: { usePreset: 'node' },
      terserOptions: true,
    },
  },
  funcs: {
    fn: () => {},
  },
};

const userConfig = {
  dts: {
    entryPointOptions: {
      libraries: { importedLibraries: ['@dimjs/utils'] },
    },
  },
  input: 'src/index.ts',
  plugin: {
    extraPlugins: [],
    pluginConfigs: {
      terserOptions: {
        came: 1,
      },
    },
  },
  output: { format: 'esm' },
};

const result = mergeOptions(defaultConfig, userConfig);
```

### Handling Undefined Values

```typescript
import { mergeOptions } from '@hyperse/deep-merge';

const target = {
  a: 1,
  b: { c: 2, d: 3 },
  e: 'hello',
};

const source = {
  a: undefined,
  b: { c: undefined, f: 4 },
  e: undefined,
};

// Without merging undefined values (default)
const result1 = mergeOptions(target, source);
// Result: { a: 1, b: { c: 2, d: 3, f: 4 }, e: 'hello' }

// With merging undefined values
const result2 = mergeOptions(target, source, true);
// Result: { a: undefined, b: { c: undefined, d: 3, f: 4 }, e: undefined }
```

### Deep Cloning

```typescript
import { simpleDeepClone } from '@hyperse/deep-merge';

const original = {
  user: { name: 'John', preferences: { theme: 'dark' } },
  settings: [1, 2, { nested: true }],
};

const clone = simpleDeepClone(original);

// Modifying the original doesn't affect the clone
original.user.name = 'Jane';
original.settings[0] = 999;

console.log(clone.user.name); // 'John'
console.log(clone.settings[0]); // 1
```

### Class Instance Handling

```typescript
import { mergeOptions } from '@hyperse/deep-merge';

class User {
  constructor(public name: string) {}
}

class Config {
  constructor(public value: number) {}
}

const target = {
  user: new User('John'),
  config: new Config(100),
  data: { x: 1, y: 2 },
};

const source = {
  user: new User('Jane'),
  data: { y: 3, z: 4 },
};

const result = mergeOptions(target, source);
// Class instances are replaced entirely
// result.user is the new User('Jane') instance
// result.data is { x: 1, y: 3, z: 4 }
```

## Important Notes

### Array Behavior

Arrays are treated as single values and are completely replaced during merging:

```typescript
const target = { items: [1, 2, 3] };
const source = { items: [4, 5] };

const result = mergeOptions(target, source);
// result.items is [4, 5], not [1, 2, 3, 4, 5]
```

### Class Instance Behavior

Class instances are not recursively merged - they are replaced entirely:

```typescript
class MyClass {
  constructor(public value: number) {}
}

const target = { obj: new MyClass(1) };
const source = { obj: new MyClass(2) };

const result = mergeOptions(target, source);
// result.obj is the new MyClass(2) instance
```

### Immutability

The target object is never mutated. A new object is always returned:

```typescript
const target = { a: 1, b: { c: 2 } };
const source = { b: { c: 3 } };

const result = mergeOptions(target, source);
console.log(target === result); // false
console.log(target.b === result.b); // false
```

## TypeScript Support

The library provides full TypeScript support with generic types:

```typescript
interface Config {
  name: string;
  settings: {
    theme: string;
    debug: boolean;
  };
  plugins: string[];
}

const defaultConfig: Config = {
  name: 'default',
  settings: { theme: 'light', debug: false },
  plugins: [],
};

const userConfig: DeepPartial<Config> = {
  settings: { theme: 'dark' },
};

const result = mergeOptions(defaultConfig, userConfig);
// result is typed as Config
```

## Performance Considerations

- `mergeOptions` creates deep clones of the target object, so it's best suited for configuration merging rather than high-frequency operations
- `simpleDeepClone` is optimized for simple objects and is much faster than JSON.parse/stringify methods
- Class instances are not cloned to preserve their behavior and methods

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
