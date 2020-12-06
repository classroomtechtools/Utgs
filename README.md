# Utgs

A library that can be used by the Google AppsScript's online editor to conduct unit tests. Stands for Unit Testing with Google appsScripts.

## Quickstart

The project id is `1cSXAtmjHA61q0KXQLo4nVq7M2ISdhIq01qucWxbpPqZGYldoxE-hxF2R`. The default identifier is `Utgs`

```js
function Tests () {
  // sorta like importing, this inits the variables
  const {describe, it, asset} = Utgs.module(); 

  // conduct your tests
  describe("Test Category 1", function () {
    it("This one fails", function () {
      assert.equals({
        comment: 'If it fails, it displays in the log',
        expected: 'Yes',
        actual: 'No'
      });
    });
  });
}
```

The output (minus log info):

```
Test Category 1
  ✘ This one fails Error: Comment: If it fails, it displays in the log
     -- Failure: Expected Yes but was No
```

List of available assertions. If there is a `{}` that means it is an object with `expected`, `actual` and optional `comment` properties. If `any` can be anything, if `func` must be a function.

```js
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

## Unit tests!

This package has unit tests on itself, which is also useful to check out how to use it.

## Motivation

Unit testing is worth it.

## Thanks

Much of the original code came from [GSUnit](https://sites.google.com/site/scriptsexamples/custom-methods/gsunit), with additional refactoring and the additional function assertions.

