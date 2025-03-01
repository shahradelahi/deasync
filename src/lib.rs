#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use napi::sys::{uv_run, uv_run_mode};
use napi::{bindgen_prelude::*, Env, JsBoolean};
use std::thread;

#[napi]
pub fn run_loop_once(env: Env) -> Result<()> {
  let loop_ = env.get_uv_event_loop()?;
  unsafe { uv_run(loop_, uv_run_mode::UV_RUN_ONCE) };

  // Manually run ticks in microtasks queue
  // https://github.com/nodejs/node/blob/464485397ac55bcd4b2199fccd7503bb84da58b6/lib/internal/bootstrap/node.js#L355
  env.run_script::<_, ()>("process._tickCallback();")?;

  Ok(())
}

/**
 * Sleep blocks the current thread for the specified number of milliseconds.
 *
 * @example
 *
 * ```typescript
 * import { sleep } from '@se-oss/deasync';
 *
 * console.log(Date.now(), 'Hello');
 * sleep(1000);
 * console.log(Date.now(), 'World!');
 * ```
 *
 * @param millis The number of milliseconds to sleep for.
 */
#[napi]
pub fn sleep(millis: u32) {
  thread::sleep(std::time::Duration::from_millis(millis as u64));
}

/**
 * Continuously runs the Node.js event loop while the provided predicate function returns `true`.
 *
 * This function allows executing asynchronous tasks while blocking execution until a condition is met.
 * It repeatedly calls `runLoopOnce`, which processes pending events in the Node.js event loop.
 *
 * @example
 *
 * ```typescript
 * import { sleep } from '@se-oss/deasync';
 * let done = false;
 *
 * setTimeout(() => {
 *   done = true;
 * }, 1000);
 *
 * loopWhile(() => !done);
 * // The task is now complete
 * ```
 *
 * @param env The Node.js environment handle.
 * @param pred A predicate function that returns a boolean. Execution continues while this function returns `true`.
 */

#[napi]
pub fn loop_while<T: Fn() -> Result<JsBoolean>>(env: Env, pred: T) -> Result<()> {
  loop {
    run_loop_once(env)?;
    if !pred()?.get_value()? {
      break;
    }
  }

  Ok(())
}
