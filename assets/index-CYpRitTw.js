var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _ApiClient_static, request_fn, _ORIGIN, _OPTIONS, _props, _element;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function isIterable(a) {
  return typeof (a === null || a === void 0 ? void 0 : a[Symbol.iterator]) === "function";
}
function isAsyncIterable(a) {
  return typeof (a === null || a === void 0 ? void 0 : a[Symbol.asyncIterator]) === "function";
}
function toIterator(iterable) {
  if (isIterable(iterable)) {
    return iterable[Symbol.iterator]();
  }
  if (isAsyncIterable(iterable)) {
    return iterable[Symbol.asyncIterator]();
  }
  throw new TypeError("toIterator: iterable must be type of Iterable or AsyncIterable");
}
const empty = function* () {
};
const isPromise = (a) => {
  if (a instanceof Promise) {
    return true;
  }
  if (a !== null && typeof a === "object" && typeof a.then === "function" && typeof a.catch === "function") {
    return true;
  }
  return false;
};
const isString$1 = (input) => typeof input === "string";
function sync$7(f, iterable) {
  const iterator = iterable[Symbol.iterator]();
  return {
    next() {
      const { done, value } = iterator.next();
      if (done) {
        return {
          done: true,
          value: void 0
        };
      }
      return {
        done: false,
        value: f(value)
      };
    },
    [Symbol.iterator]() {
      return this;
    }
  };
}
function async$8(f, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  return {
    async next(_concurrent) {
      const { done, value } = await iterator.next(_concurrent);
      if (done)
        return { done, value };
      return {
        done: false,
        value: await f(value)
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function map(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return map(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return sync$7(f, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$8(f, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
const pipe1 = (a, f) => {
  return isPromise(a) ? a.then(f) : f(a);
};
function sync$6(f, acc, iterable) {
  for (const a of iterable) {
    acc = f(acc, a);
  }
  return acc;
}
async function async$7(f, acc, iterable) {
  for await (const a of iterable) {
    acc = await pipe1(acc, (acc2) => f(acc2, a));
  }
  return acc;
}
function reduce(f, seed, iterable) {
  if (iterable === void 0) {
    if (seed === void 0) {
      return (iterable2) => reduce(f, iterable2);
    }
    if (isIterable(seed)) {
      const iterator = seed[Symbol.iterator]();
      const { done, value } = iterator.next();
      if (done) {
        throw new TypeError("'reduce' of empty iterable with no initial value");
      }
      return sync$6(f, value, {
        [Symbol.iterator]() {
          return iterator;
        }
      });
    }
    if (isAsyncIterable(seed)) {
      const iterator = seed[Symbol.asyncIterator]();
      return iterator.next().then(({ done, value }) => {
        if (done) {
          throw new TypeError("'reduce' of empty iterable with no initial value");
        }
        return async$7(f, value, {
          [Symbol.asyncIterator]() {
            return iterator;
          }
        });
      });
    }
    throw new TypeError("'iterable' must be type of Iterable or AsyncIterable. Are you looking for 'reduceLazy'?");
  }
  if (isIterable(iterable)) {
    return sync$6(f, seed, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$7(f, Promise.resolve(seed), iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function pipe(a, ...fns) {
  return reduce(pipe1, a, fns);
}
function* range(start, end, step = 1) {
  if (end === void 0)
    return yield* range(0, start);
  if (step < 0) {
    while (start > end) {
      yield start;
      start += step;
    }
  } else {
    while (start < end) {
      yield start;
      start += step;
    }
  }
}
class AsyncFunctionException extends Error {
  constructor(message = AsyncFunctionException.MESSAGE) {
    super(message);
  }
}
AsyncFunctionException.MESSAGE = `'Iterable' can not used with async function.
If you want to deal with async function, see: [toAsync](https://fxts.dev/docs/toAsync)`;
const throwIfPromiseError = (a) => {
  if (isPromise(a)) {
    throw new AsyncFunctionException();
  }
  return a;
};
class Concurrent {
  constructor(length) {
    this.length = length;
  }
  static of(length) {
    return new Concurrent(length);
  }
}
const isConcurrent = (concurrent2) => {
  return concurrent2 instanceof Concurrent;
};
function concurrent(length, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return concurrent(length, iterable2);
    };
  }
  if (!Number.isFinite(length) || length <= 0) {
    throw new RangeError("'length' must be positive integer");
  }
  if (!isAsyncIterable(iterable)) {
    throw new TypeError("'iterable' must be type of AsyncIterable");
  }
  const iterator = iterable[Symbol.asyncIterator]();
  const buffer = [];
  let prev = Promise.resolve();
  let nextCallCount = 0;
  let resolvedItemCount = 0;
  let finished = false;
  let pending = false;
  const settlementQueue = [];
  const consumeBuffer = () => {
    while (buffer.length > 0 && nextCallCount > resolvedItemCount) {
      const p = buffer.shift();
      const [resolve, reject] = settlementQueue.shift();
      if (p.status === "fulfilled") {
        resolvedItemCount++;
        resolve(p.value);
        if (p.value.done) {
          finished = true;
        }
      } else {
        reject(p.reason);
        finished = true;
        break;
      }
    }
  };
  const fillBuffer = () => {
    if (pending) {
      prev = prev.then(() => void (!finished && nextCallCount > resolvedItemCount && fillBuffer()));
    } else {
      const nextItems = Promise.allSettled(Array.from({ length }, () => iterator.next(Concurrent.of(length))));
      pending = true;
      prev = prev.then(() => nextItems).then((nextItems2) => {
        buffer.push(...nextItems2);
        pending = false;
        recur();
      });
    }
  };
  function recur() {
    if (finished || nextCallCount === resolvedItemCount) {
      return;
    } else if (buffer.length > 0) {
      consumeBuffer();
    } else {
      fillBuffer();
    }
  }
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      nextCallCount++;
      if (finished) {
        return { done: true, value: void 0 };
      }
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);
        recur();
      });
    }
  };
}
function* sync$5(f, iterable) {
  for (const item of iterable) {
    yield item;
    const res = f(item);
    if (isPromise(res)) {
      throw new AsyncFunctionException();
    }
    if (res) {
      break;
    }
  }
}
function asyncSequential$3(f, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  let end = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      if (end) {
        return { done: true, value: void 0 };
      }
      const { done, value } = await iterator.next(_concurrent);
      if (done || end) {
        return { done: true, value: void 0 };
      }
      const cond = await f(value);
      if (end) {
        return { done: true, value: void 0 };
      }
      if (cond) {
        end = true;
      }
      return { done: false, value };
    }
  };
}
function async$6(f, iterable) {
  let _iterator;
  return {
    async next(_concurrent) {
      if (_iterator === void 0) {
        _iterator = isConcurrent(_concurrent) ? asyncSequential$3(f, concurrent(_concurrent.length, iterable)) : asyncSequential$3(f, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function takeUntil(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return takeUntil(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return sync$5(f, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$6(f, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function not(a) {
  return !a;
}
function every(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return every(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return pipe(map((a) => throwIfPromiseError(f(a)), iterable), takeUntil(not), (acc) => reduce((a, b) => a && b, true, acc), (a) => a !== null && a !== void 0 ? a : true, Boolean);
  }
  if (isAsyncIterable(iterable)) {
    return pipe(map(f, iterable), takeUntil(not), (acc) => reduce((a, b) => a && b, true, acc), (a) => a !== null && a !== void 0 ? a : true, Boolean);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
async function async$5(iterable) {
  const res = [];
  for await (const item of iterable) {
    res.push(item);
  }
  return res;
}
function toArray(iter) {
  if (isAsyncIterable(iter)) {
    return async$5(iter);
  } else if (isIterable(iter)) {
    return Array.from(iter);
  } else {
    return [];
  }
}
const isArray = (input) => Array.isArray(input);
function last(iterable) {
  if (isArray(iterable) || isString$1(iterable)) {
    return iterable[iterable.length - 1];
  }
  if (isIterable(iterable)) {
    return reduce((_, a) => a, iterable);
  } else if (isAsyncIterable(iterable)) {
    return reduce((_, a) => a, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function toAsync(iter) {
  const iterator = iter[Symbol.iterator]();
  return {
    async next() {
      const { value, done } = iterator.next();
      if (isPromise(value)) {
        return value.then((value2) => ({ done, value: value2 }));
      } else {
        return { done, value };
      }
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function* sync$4(f, iterable) {
  for (const item of iterable) {
    const res = f(item);
    if (isPromise(res)) {
      throw new AsyncFunctionException();
    }
    if (!res) {
      break;
    }
    yield item;
  }
}
function asyncSequential$2(f, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  let end = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const { done, value } = await iterator.next(_concurrent);
      if (done || end) {
        return { done: true, value: void 0 };
      }
      if (!await f(value)) {
        end = true;
        return { done: true, value: void 0 };
      }
      return { done: false, value };
    }
  };
}
function async$4(f, iterable) {
  let _iterator;
  return {
    async next(_concurrent) {
      if (_iterator === void 0) {
        _iterator = isConcurrent(_concurrent) ? asyncSequential$2(f, concurrent(_concurrent.length, iterable)) : asyncSequential$2(f, iterable);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function takeWhile(f, iterable) {
  if (iterable === void 0) {
    return (iterable2) => {
      return takeWhile(f, iterable2);
    };
  }
  if (isIterable(iterable)) {
    return sync$4(f, iterable);
  }
  if (isAsyncIterable(iterable)) {
    return async$4(f, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function sync$3(iterable) {
  const iterators = toArray(map((a) => toIterator(a), iterable));
  return pipe(range(Infinity), map(() => toArray(map((it) => it.next(), iterators))), takeWhile(every((cur2) => !cur2.done)), map((cur1) => toArray(map((cur2) => cur2.value, cur1))));
}
function async$3(iterable) {
  const iterators = toArray(map(toIterator, iterable));
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const headIterators = await pipe(toAsync(iterators), map((it) => it.next(_concurrent)), toArray);
      const hasDone = headIterators.some((it) => it.done);
      if (hasDone) {
        return { done: true, value: void 0 };
      }
      return {
        done: false,
        value: headIterators.map((it) => it.value)
      };
    }
  };
}
function zip(...iterables) {
  if (iterables.length < 2) {
    return (...iterables2) => {
      return zip(...iterables, ...iterables2);
    };
  }
  if (iterables.some((a) => !isIterable(a) && !isAsyncIterable(a))) {
    throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
  }
  const hasAsyncIterable = iterables.some((iterable) => isAsyncIterable(iterable));
  if (hasAsyncIterable) {
    return async$3(iterables);
  }
  return sync$3(iterables);
}
function* sync$2(a, iterable) {
  yield* iterable;
  yield a;
}
function asyncSequential$1(a, iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  let finished = false;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      if (finished) {
        return { done: true, value: void 0 };
      }
      const { value, done } = await iterator.next();
      if (finished) {
        return { done: true, value: void 0 };
      }
      if (done) {
        finished = true;
        return { done: false, value: await a };
      } else {
        return { done, value };
      }
    }
  };
}
function async$2(a, iterable) {
  let iterator = null;
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      if (iterator === null) {
        iterator = isConcurrent(_concurrent) ? asyncSequential$1(a, concurrent(_concurrent.length, iterable)) : asyncSequential$1(a, iterable);
      }
      return iterator.next(_concurrent);
    }
  };
}
function append(a, iterable) {
  if (iterable === void 0) {
    return (iterable2) => append(a, iterable2);
  }
  if (isAsyncIterable(iterable)) {
    return async$2(isPromise(a) ? a : Promise.resolve(a), iterable);
  }
  if (isIterable(iterable)) {
    return sync$2(a, iterable);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
function* sync$1(a, b) {
  yield* a;
  yield* b;
}
function async$1(a, b) {
  let leftDone = false;
  const leftIterator = a[Symbol.asyncIterator]();
  const rightIterator = b[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(_concurrent) {
      const iterator = leftDone ? rightIterator : leftIterator;
      const { done, value } = await iterator.next(_concurrent);
      if (done) {
        if (iterator === leftIterator) {
          leftDone = true;
        }
        return rightIterator.next(_concurrent);
      } else {
        return { done, value };
      }
    }
  };
}
function toAsyncIterable(iterable) {
  if (isAsyncIterable(iterable)) {
    return iterable;
  }
  const iterator = iterable[Symbol.iterator]();
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function concat(iterable1, iterable2) {
  if (iterable2 === void 0) {
    return (iterable22) => {
      return concat(iterable1, iterable22);
    };
  }
  if (isAsyncIterable(iterable1) || isAsyncIterable(iterable2)) {
    return async$1(toAsyncIterable(iterable1), toAsyncIterable(iterable2));
  }
  if (isIterable(iterable1) && isIterable(iterable2)) {
    return sync$1(iterable1, iterable2);
  }
  throw new TypeError("'iterable1','iterable2' must be type of Iterable or AsyncIterable");
}
const isFlatAble = function(a) {
  return typeof a !== "string" && isIterable(a);
};
function sync(iterable, depth) {
  const iterator = iterable[Symbol.iterator]();
  const iteratorStack = [
    iterator
  ];
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      while (iteratorStack.length > 0) {
        const currentIterator = last(iteratorStack);
        const { value, done } = currentIterator.next();
        if (done) {
          iteratorStack.pop();
          continue;
        }
        if (isFlatAble(value) && iteratorStack.length < depth + 1) {
          iteratorStack.push(value[Symbol.iterator]());
          continue;
        }
        return {
          done: false,
          value
        };
      }
      return {
        done: true,
        value: void 0
      };
    }
  };
}
function asyncConcurrent(iterable, depth) {
  const originIterator = iterable[Symbol.asyncIterator]();
  let prevItem = Promise.resolve();
  let flattenIterator = empty();
  let finished = false;
  const settlementQueue = [];
  const fillItem = async () => {
    const { done, value } = await originIterator.next();
    if (done) {
      return false;
    }
    if (isFlatAble(value)) {
      flattenIterator = concat(sync(value, depth - 1), flattenIterator);
    } else {
      flattenIterator = append(value, flattenIterator);
    }
    return true;
  };
  const pullItem = async () => {
    if (finished) {
      return { done: true, value: void 0 };
    }
    const { value, done } = flattenIterator.next();
    if (done) {
      const hasItem = await fillItem();
      if (hasItem) {
        return pullItem();
      }
      return { done: true, value: void 0 };
    }
    return { done: false, value };
  };
  const resolveItem = ({ done, value }) => {
    if (done || finished) {
      while (settlementQueue.length > 0) {
        const [resolve2] = settlementQueue.shift();
        resolve2({ done: true, value: void 0 });
      }
      return;
    }
    const [resolve] = settlementQueue.shift();
    resolve({ done, value });
  };
  const catchItem = (err) => {
    finished = true;
    const [_, reject] = settlementQueue.shift();
    reject(err);
  };
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      return new Promise((resolve, reject) => {
        settlementQueue.push([resolve, reject]);
        prevItem = prevItem.then(() => pullItem()).then(resolveItem).catch(catchItem);
      });
    }
  };
}
function asyncSequential(iterable, depth) {
  const iterator = iterable[Symbol.asyncIterator]();
  const iteratorStack = [
    iterator
  ];
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next() {
      const iterator2 = last(iteratorStack);
      if (!iterator2) {
        return { done: true, value: void 0 };
      }
      const { value, done } = await iterator2.next();
      if (done) {
        iteratorStack.pop();
        return this.next();
      }
      if (isFlatAble(value) && iteratorStack.length < depth + 1) {
        iteratorStack.push(value[Symbol.iterator]());
        return this.next();
      }
      return {
        done: false,
        value
      };
    }
  };
}
function async(iterable, depth) {
  let _iterator = null;
  return {
    async next(_concurrent) {
      if (_iterator === null) {
        _iterator = isConcurrent(_concurrent) ? asyncConcurrent(concurrent(_concurrent.length, iterable), depth) : asyncSequential(iterable, depth);
      }
      return _iterator.next(_concurrent);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function flat(iterable, depth = 1) {
  if (isIterable(iterable)) {
    return sync(iterable, depth);
  }
  if (isAsyncIterable(iterable)) {
    return async(iterable, depth);
  }
  throw new TypeError("'iterable' must be type of Iterable or AsyncIterable");
}
const isElement = (target) => {
  return target instanceof Element;
};
const isHTMLFormElement = (target) => {
  return target instanceof HTMLFormElement;
};
const isError = (error) => error instanceof Error;
const isString = (str) => typeof str === "string";
const $ = (selector) => {
  return document.querySelector(selector);
};
function html(strings, ...values) {
  return pipe(
    zip(
      strings,
      concat(
        // TODO: escape
        // map((value) => escape(value), values),
        values,
        [""]
      )
    ),
    flat,
    reduce((a, b) => a + b)
  );
}
class ApiClient {
  static get(url, options) {
    return __privateMethod(this, _ApiClient_static, request_fn).call(this, "GET", url, options);
  }
}
_ApiClient_static = new WeakSet();
request_fn = async function(method, url, options) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        ...options.headers
      },
      ...options
    });
    const data = await response.json();
    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error("사용자 정보가 잘못되었습니다.");
        case 400:
          throw new Error("페이지를 초과했습니다.");
      }
    }
    return data;
  } catch (error) {
    if (isError(error)) throw error;
    if (isString(error)) throw new Error(error);
    console.error(error);
  }
};
__privateAdd(ApiClient, _ApiClient_static);
class MovieApiClient {
  static async getAll({ page }) {
    const url = new URL("/3/movie/popular", __privateGet(this, _ORIGIN));
    url.searchParams.append("page", String(page));
    url.searchParams.append("language", "ko-KR");
    return ApiClient.get(url, __privateGet(this, _OPTIONS));
  }
  static get({ query, page }) {
    const url = new URL("/3/search/movie", __privateGet(this, _ORIGIN));
    url.searchParams.append("page", String(page));
    url.searchParams.append("language", "ko-KR");
    url.searchParams.append("query", query);
    return ApiClient.get(url, __privateGet(this, _OPTIONS));
  }
}
_ORIGIN = new WeakMap();
_OPTIONS = new WeakMap();
__privateAdd(MovieApiClient, _ORIGIN, "https://api.themoviedb.org");
__privateAdd(MovieApiClient, _OPTIONS, {
  headers: { Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmEwYTdiNzE4ODA4YTVmYTJjZWMxNGYwOTNjZDZjZCIsIm5iZiI6MTc0MjI2MzAzMS41MTYsInN1YiI6IjY3ZDhkMmY3NGYwMjQ2ZGUzOWVlOWZlYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wYazrK1XQKvh5qGf8BQcnljLKMMRTdUGBv6KcRxAvHw"}` }
});
class Component {
  constructor(props) {
    __publicField(this, "state", {});
    __privateAdd(this, _props);
    __privateAdd(this, _element, null);
    __privateSet(this, _props, props ?? {});
    this.setup();
    this.render();
    this.addEventListener();
    this.dataFetchAsync();
  }
  dataFetchAsync() {
  }
  setup() {
  }
  render() {
    const element = document.createElement("div");
    element.innerHTML = this.template();
    const elementFirstChild = element.firstElementChild;
    if (!__privateGet(this, _element)) __privateSet(this, _element, elementFirstChild);
    else __privateGet(this, _element).innerHTML = elementFirstChild.innerHTML;
    this.onRender();
    return __privateGet(this, _element);
  }
  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    this.render();
  }
  appendChild(element, selector) {
    var _a;
    if (selector) (_a = this.element.querySelector(selector)) == null ? void 0 : _a.appendChild(element);
    else this.element.appendChild(element);
  }
  template() {
    return html`<div></div>`;
  }
  addEventListener() {
  }
  onRender() {
  }
  fillSlot(element, slotName) {
    const targetSlot = this.element.querySelector(`slot[name=${slotName}]`);
    if (!targetSlot) throw new Error(`name=${slotName} 속성을 가진 slot 요소를 만들어주세요.`);
    targetSlot.replaceWith(element);
  }
  get element() {
    return __privateGet(this, _element);
  }
  get props() {
    return __privateGet(this, _props);
  }
}
_props = new WeakMap();
_element = new WeakMap();
class Footer extends Component {
  template() {
    return html`
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="./images/woowacourse_logo.png" width="180" /></p>
      </footer>
    `;
  }
}
const DEFAULT_BACK_DROP_URL = "https://media.themoviedb.org/t/p/w440_and_h660_face/";
class Header extends Component {
  template() {
    return html`
      <header class="background-container">
        ${this.props.search ? "" : '<div class="overlay" aria-hidden="true"></div>'}
        <div class="top-rated-header">
          <a href="/javascript-movie-review">
            <h1 class="logo">
              <img src="./images/logo.png" alt="MovieList" />
            </h1>
          </a>
          <form class="top-rated-search">
            <input
              id="top-rated-search-input"
              class="top-rated-search-input"
              placeholder="검색어를 입력하세요"
              name="search"
              value="${this.props.search}"
            />
            <button type="submit" class="top-rated-search-button">
              <img src="./images/search.svg" alt="MovieSearch" />
            </button>
          </form>
        </div>

        ${this.props.search ? "" : '<div class="top-rated-container"></div>'}
      </header>
    `;
  }
  onRender() {
    if (this.props.search) this.element.style.backgroundImage = "";
    else if (this.props.backgroundImage)
      this.element.style.backgroundImage = `url(${DEFAULT_BACK_DROP_URL}${this.props.backgroundImage})`;
  }
}
class ThumbnailList extends Component {
  template() {
    if (!this.props.movies)
      return html`
        <ul class="thumbnail-list">
          ${new Array(20).fill(null).map(
        (_) => `<li>
                <div class="item">
                  <div class="skeleton" style="width:200px; height:300px"></div>
                  <div class="item-desc">
                    <div class="skeleton" style="width:60px; height:16px"></div>
                    <div class="skeleton" style="width:150px; height:16px"></div>
                  </div>
                </div>
              </li>`
      ).join("")}
        </ul>
      `;
    if (this.props.movies.length === 0)
      return html`
        <div class="error">
          <img src="./images/woowawa_planet.svg" alt="woowawa_planet" />
          <h2>검색 결과가 없습니다.</h2>
        </div>
      `;
    return html`
      <ul class="thumbnail-list">
        ${this.props.movies.map((movie) => {
      const backgroundImage = movie.backdrop_path ? `${DEFAULT_BACK_DROP_URL}${movie.backdrop_path}` : "./images/default_thumbnail.jpeg";
      return `
              <li>
                <div class="item">
                  <img
                    class="thumbnail"
                    src="${backgroundImage}"
                    alt="${movie.title}"
                  />
                  <div class="item-desc">
                    <p class="rate">
                      <img src="./images/star_empty.png" class="star" />
                      <span>${movie.vote_average}</span>
                    </p>
                    <strong>${movie.title}</strong>
                  </div>
                </div>
              </li>
          `;
    }).join("")}
      </section>
    `;
  }
}
const TAB_LIST = ["상영 중", "인기순", "평점순", "상영 예정"];
class Movies extends Component {
  template() {
    if (this.props.error) return html`<div class="error">${this.props.error.message}</div>`;
    return html`
      <div class="container">
        <ul class="tab">
          ${TAB_LIST.map(
      (tab) => `
              <li>
                <a href="#">
                  <div class="tab-item"><h3>${tab}</h3></div>
                </a>
              </li>
            `
    ).join("")}
        </ul>
        <main>
          <section>
            <h2 class="thumbnail-title">${this.props.search || "지금 인기 있는 영화"}</h2>
            <slot name="thumbnail-list"> </slot>

            <slot name="error"></slot>

            <div class="error close">
              <img src="./images/woowawa_planet.svg" alt="woowawa_planet" />
              <h2></h2>
            </div>
          </section>
        </main>
        ${this.props.movies && this.props.movies.length > 0 && this.props.totalPages > this.props.page ? '<button class="primary show-more" data-action="show-more">더 보기</button>' : ""}
      </div>
    `;
  }
  async onRender() {
    this.fillSlot(
      new ThumbnailList({
        movies: this.props.movies
      }).element,
      "thumbnail-list"
    );
  }
}
class App extends Component {
  constructor() {
    super();
  }
  setup() {
    this.state = {
      page: 1,
      totalPages: 1,
      moviesResponse: null,
      movies: null,
      error: null,
      search: ""
    };
  }
  template() {
    return html`
      <div id="movie-review-wrap">
        <slot name="header"></slot>
        <slot name="movies"></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
  onRender() {
    var _a, _b, _c;
    this.fillSlot(
      new Header({
        search: this.state.search,
        backgroundImage: (_b = (_a = this.state.movies) == null ? void 0 : _a.at(0)) == null ? void 0 : _b.backdrop_path
      }).element,
      "header"
    );
    this.fillSlot(
      new Movies({
        movies: this.state.movies,
        totalPages: ((_c = this.state.moviesResponse) == null ? void 0 : _c.total_pages) ?? 1,
        page: this.state.page,
        search: this.state.search,
        error: this.state.error
      }).element,
      "movies"
    );
    this.fillSlot(new Footer().element, "footer");
  }
  async getMovie(search, page) {
    let moviesResponse;
    try {
      if (search)
        moviesResponse = await MovieApiClient.get({
          query: search,
          page
        });
      else moviesResponse = await MovieApiClient.getAll({ page });
    } catch (error) {
      if (isError(error)) this.setState({ error });
      else if (isString(error)) this.setState({ error: new Error(error) });
      else this.setState({ error: new Error("에러 발생") });
    }
    if (this.state.movies)
      this.setState({
        moviesResponse,
        movies: [...this.state.movies, ...moviesResponse.results],
        page
      });
    else
      this.setState({
        moviesResponse,
        movies: moviesResponse.results,
        page
      });
  }
  async dataFetchAsync() {
    this.getMovie(this.state.search, this.state.page);
  }
  addEventListener() {
    window.addEventListener("click", async (event) => {
      const { target } = event;
      if (!isElement(target)) return;
      if (target.closest(".show-more")) {
        this.getMovie(this.state.search, this.state.page + 1);
      }
    });
    window.addEventListener("submit", async (event) => {
      event.preventDefault();
      const { target } = event;
      if (!isHTMLFormElement(target)) return;
      if (target.closest(".top-rated-search")) {
        const formData = new FormData(target);
        const modalInput = Object.fromEntries(formData);
        this.setState({
          search: String(modalInput.search),
          page: 1,
          movies: null
        });
        await this.dataFetchAsync();
      }
    });
  }
}
addEventListener("load", async () => {
  $("#app").appendChild(new App().element);
});
