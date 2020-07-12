# UnitTesting

Assertion and unit testing of modular libraries. This is based on 

## UnitTesting.gs Quickstart

Intended to be used via node, `npm install @classroomtechtools/unittesting`.

## Unit tests!

This package has unit tests on itself, which is also useful to check out how to use it.

`npm run test`

## API

Every function on `assert` takes one parameters, which is an object. Most of them require `actual` and `expected`.

```
assert.equals({})
assert.true_(any)
assert.false_(any)
assert.null_(any);
assert.notNull(any)
assert.undefined_(any)
assert.notUndefined(any);
assert.NaN_(any);
assert.notNaN(any);
assert.evaluatesToTrue(any);
assert.evaluatesToFalse(any);

assert.arrayEquals({});
assert.arrayEqualsIgnoringOrder({});
assert.objectEquals({});
assert.hashEquals({});
assert.roughlyEquals({});  // also tolerance property required
assert.contains({value: any, collection: any});

assert.throwsError(func)
assert.throwsTypeError(func)
assert.throwsRangeError(func)
assert.throwsReferenceError(func)

assert.doesNotThrowError(func)
```

## Motivation

Unit testing is worth it.

## Thanks

Much of the original code came from [GSUnit](https://sites.google.com/site/scriptsexamples/custom-methods/gsunit), with additional refactoring and the additional function assertions.

