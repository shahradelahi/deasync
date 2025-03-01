import type { TupleToUnion, UnionToIntersection } from 'type-fest';

import { loopWhile } from './bindings';

// -- Internal ------------------------

type AnyFunc = (...args: any[]) => any;

type CallbackWithResult<TResult> = (err: any, result: TResult, ...rest: any) => void;

type RequiredParameters<T extends AnyFunc> = Required<Parameters<T>>;
type ExtractCallback<T extends AnyFunc> = LastOfUnion<TupleToUnion<Parameters<T>>>;

type LastOfUnion<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

// -- Exported ------------------------

/**
 * Converts an asynchronous function into a synchronous one by blocking execution
 * until the callback is called.
 *
 * This function wraps an async function (which follows the Node.js callback pattern)
 * and waits until the provided callback is invoked before returning the result.
 *
 * @example
 *
 * ```typescript
 * import { deasync } from '@se-oss/deasync';
 *
 * function asyncFunction(input: string, callback: (err: any, result: string) => void) {
 *   setTimeout(() => {
 *     callback(null, `Hello, ${input}!`);
 *   }, 1000);
 * }
 *
 * const syncFunction = deasync(asyncFunction);
 * console.log(syncFunction("World")); // Blocks for 1 second, then prints "Hello, World!"
 * ```
 *
 * @template T - The type of the original function.
 * @template Args - The arguments of the original function, excluding the callback.
 * @template Result - The result type extracted from the callback.
 * @param fn - The asynchronous function to be converted.
 * @returns A synchronous version of the provided function.
 */
export function deasync<
  T extends AnyFunc,
  Args extends any[] = RequiredParameters<T> extends [...infer A, any] ? A : never,
  Result = ExtractCallback<T> extends CallbackWithResult<infer U> ? U : never,
>(fn: T): (...args: Args) => Result {
  return function () {
    let done = false;
    let err;
    let res;

    const cb: AnyFunc = function (e, r) {
      err = e;
      res = r;
      done = true;
    };
    const args = Array.prototype.slice.apply(arguments).concat(cb);

    // @ts-expect-error I don't know how to implement `this` and im very tired!
    fn.apply(this, args);

    loopWhile(() => !done);
    if (err) throw err;

    return res;
  } as any;
}

export * from './bindings';
