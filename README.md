# Utgs

**U**nit **T**esting with **G**oogle apps**S**cripts

A library that can be used by the online editor to conduct unit tests. You create a function such as Tests and declare how your code is supposed to work. Whenever you make changes to your code, you just run the test function to check.

Documentation on usage [is available](https://classroomtechtools.github.io/Utgs/).

## Quickstart

The project id is `1cSXAtmjHA61q0KXQLo4nVq7M2ISdhIq01qucWxbpPqZGYldoxE-hxF2R`. The default identifier is `Utgs`

```js
function Tests () {
  // sorta like importing, this inits the variables
  const {describe, it, assert} = Utgs.module(); 

  // conduct your tests
  describe("Test Category 1", function () {
    it("This one fails", function () {

      // do work
      const value = myFunction(); 

      assert.equals({
        comment: 'If it fails, it displays in the log',
        expected: 'Yes',
        actual: value
      });
    });
  });
}
```

If `value` is not `"Yes"`, it throws an error that lets you track it down:

```
Test Category 1
  ✘ This one fails Error: Comment: If it fails, it displays in the log
     -- Failure: Expected Yes but was No
```



## Node

Can also be installed via node, `npm install @classroomtechtools/unittesting`.

This package has unit tests on itself, which is also useful to check out how to use it.

`npm run test`

## Motivation

Unit testing makes us better programmers.

## Thanks

Much of the original code came from [GSUnit](https://sites.google.com/site/scriptsexamples/custom-methods/gsunit), with additional refactoring and the additional function assertions.

