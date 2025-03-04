# @se-oss/deasync

[![CI](https://github.com/shahradelahi/deasync/actions/workflows/CI.yml/badge.svg)](https://github.com/shahradelahi/deasync/actions/workflows/CI.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/deasync.svg)](https://www.npmjs.com/package/@se-oss/deasync)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/deasync)](https://packagephobia.com/result?p=@se-oss/deasync)

_@se-oss/deasync_ is a Node.js addon that enables synchronous execution of asynchronous functions by blocking the event loop. The core of project is written in Rust for performance and reliability.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#license)

## 📦 Installation

```bash
npm install @se-oss/deasync
```

## 📖 Usage

#### Wrapping an Asynchronous Function

`deasync` converts an asynchronous function with the conventional callback pattern `function(p1, ...pn, callback(error, result))` into a synchronous function. It returns the result and throws an error if one occurs.

```typescript
import { deasync } from '@se-oss/deasync';

function asyncFunction(input: string, callback: (err: any, result: string) => void) {
  setTimeout(() => {
    callback(null, `Hello, ${input}!`);
  }, 1000);
}

const syncFunction = deasync(asyncFunction);
console.log(syncFunction("World")); // Blocks for 1 second, then prints "Hello, World!"
```

#### Blocking Execution with `loopWhile`

Use `loopWhile(predicateFunc)` to block execution while the given predicate function returns `true`.

```typescript
import { sleep } from '@se-oss/deasync';
let done = false;

setTimeout(() => {
  done = true;
}, 1000);

loopWhile(() => !done);

// The task is now complete
```

#### Sleeping for a Fixed Duration

The sleep function blocks the current thread for the specified number of milliseconds. It behaves similarly to the [`Atomic.wait()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait) API.

```typescript
import { sleep } from '@se-oss/deasync';

console.log(Date.now(), 'Hello');
sleep(1000);
console.log(Date.now(), 'World!');
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/deasync).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/deasync)

Thanks again for your support, it is much appreciated! 🙏

## 🙌 Credits

This project is inspired by [deasync](https://github.com/abbr/deasync), originally created by [Vladimir Kurchatkin](https://github.com/vkurchatkin) and later maintained by [@abbr](https://github.com/abbr).

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/deasync/graphs/contributors).
