import { expect, test } from 'vitest';

import { deasync, loopWhile, sleep } from '../index';

function asyncFunction(input: string, callback: (err: any, result: string) => void) {
  setTimeout(() => {
    callback(null, `Hello, ${input}!`);
  }, 1000);
}

test('deasync', () => {
  const desyncFunc = deasync(asyncFunction);
  const res = desyncFunc('World');
  expect(res).toBe('Hello, World!');
});

test('loopWhile', () => {
  let done = false;

  setTimeout(() => {
    done = true;
  }, 1000);

  loopWhile(() => !done);
  expect(done).toBe(true);
});

test('sleep', () => {
  const start = Date.now();
  sleep(1000);
  const end = Date.now();
  expect(end - start).toBeGreaterThanOrEqual(1000);
});
