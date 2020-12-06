# Utgs

**U**nit **T**esting with **G**oogle apps**S**cripts

A library that can be used with the online editor to conduct unit tests. You create a function such as Tests and declare how your code is supposed to work. Whenever you make changes to your code, you just run the test function to check.

Documentation on usage [is available](https://classroomtechtools.github.io/Utgs/).

## Quickstart

The project id is `1cSXAtmjHA61q0KXQLo4nVq7M2ISdhIq01qucWxbpPqZGYldoxE-hxF2R`. The default identifier is `Utgs`

```js
function Tests () {
  // sorta like importing, this inits the variables
  const {describe, it, assert} = Utgs.module(); 

  describe("Test Category 1", function () {
    it("Have the value of Yes", function () {
      assert.equals({
        comment: 'If it fails, it displays in the log',
        expected: 'Yes',
        actual: 'Yes'
      });
    });
    it("Have the value of No", function () {
      assert.equals({
        comment: 'If it fails, it displays in the log',
        expected: 'No',
        actual: 'Yes'
      });
    });
  });
}
```

If `value` is not `"Yes"`, it throws an error that lets you track it down:

```
Test Category 1
  ✔ Have the value of Yes
  ✘ Have the value of No -> Error: Comment: If it fails, it displays in the log
   ---> Error message: Expected <"No"> (String) but was <"Yes"> (String)
```

But when everything works, bask in the glory of lots of glorious check marks.

## Node

Can also be installed via node, `npm install @classroomtechtools/unittesting`.

This package has unit tests on itself, which is also useful to check out how to use it.

`npm run test`

## Motivation

Unit testing makes us better programmers.

## Thanks

Much of the original code came from [GSUnit](https://sites.google.com/site/scriptsexamples/custom-methods/gsunit), with additional refactoring and the additional function assertions.

