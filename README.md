# Utgs

**U**nit **T**esting with **G**oogle apps**S**cripts

A library that can be used with the online editor to conduct unit tests. You create a function such as Tests and declare how your code is supposed to work. Whenever you make changes to your code, you just run the test function to check.

Documentation on usage [is available](https://classroomtechtools.github.io/Utgs/).

## Quickstart

Use it as a library:

- The Script id is `1cSXAtmjHA61q0KXQLo4nVq7M2ISdhIq01qucWxbpPqZGYldoxE-hxF2R`. 
- The default identifier is `Utgs`

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

## Examples

Use `objectEquals` to test that two different objects have the same keys and values on the keys. This test will fail:

```js
function Tests () {
  // sorta like importing, this inits the variables
  const {describe, it, assert} = Utgs.module(); 
  describe("Test Object", function () {
    it("objects are the same", function () {
      assert.objectEquals({
        comment: 'If it fails, it displays in the log',
        expected: {yes: "yes", no: "no"},
        actual: {ha: "ha", yes: "yes"}
      });
    });
  });
}
```

```
Test Object
  ✘ objects are the same -> Error: Comment: If it fails, it displays in the log
   ---> Error message: Expected keys no, yes but found ha, yes
```

Use `arrayEquals` to test that two different arrays are the same:

```js
function Tests () {
  // sorta like importing, this inits the variables
  const {describe, it, assert} = module(); 
  describe("Test Object", function () {
    it("objects are the same", function () {
      assert.arrayEquals({
        comment: 'If it fails, it displays in the log',
        expected: [1, 2, 3],
        actual: [1, 2]
      });
    });
  });
}
```

```
Test Object
  ✘ objects are the same -> Error: Comment: If it fails, it displays in the log
   ---> Error message: Expected keys 0, 1, 2 but found 0, 1
    
```

The documentation provides all the other assertions available on the `assert` object.

## Motivation

Unit testing lets us achieve assurance that our code is doing exactly what we think it's doing. In addition, the author wanted a way to write unit tests without having to rely on the built-in objects such as `SpreadsheetApp`. 

## Dependency Injection

The above unit test example test that the function returns some value. But much of code written with appscripts is really that simple.

This section will illustrate how to also use it to implement unit tests that are more realistic, ones that have *side effects*, such as writing to a spreadsheet. These are known as side effects, as a function's result is not limited to a return value, but an effect that is produced by something it uses, a dependency.

Specifically, how do we test API calls with Spreadsheet service, where it doesn't give us back anything but does have side effects that is producing the very thing we need to test for. How do we test a function that writes to a spreadsheet actually does write to the spreadsheet?

There is a way, using a coding pattern called **dependency injection**. It's an appoach to writing functions where you declare your dependencies at the end of the function signature in an object with default values. Here's a simple example, where we're using the `Math` object to write a `floor` function:

```js
function floor (num, {dependency=Math}={}) {
  return dependency.floor(num);
}
floor(1); // uses Math since it's the default value for dependency variable
```

The above example is not very useful, but illustrates the mechanism. Instead of the function body using the name of the dependency, we've wired it so that it's using a variable `dependency` whose default value, if it is called as normal without defining  the last object specifically, will be `Math`. That gives us a function where we can change the dependency it actually uses … and in this case completely changes what it does:

```js
const MathLike = {floor: (num) => num + 'floor'};
floor(1, {depedency: MathLike});  // "1floor"
```

We can use this approach to test for side effects.

### Dependency Injection in action

Let's say we want to write a function that writes some values in a spreadsheet to `x` row. So for example `writeRow('Sheet1', 3, ['a', 'b', 'c'])` will make row `3` have `[1, 2, 3]`in the sheet `Sheet1`.

```js
/**
 * Write a spreadsheet row, starting from column A to however many values are contained in values param
 * @param {String} sheet - The sheet name
 * @param {Number} row - the row number which will take the values 
 * @param {Any[]} values - an array that represents the rows
 */
function writeRow (sheet, row, values) {
  const sheet = SpreadsheetApp.getSheetByName(sheet);
  const range = sheet.getRange(`A${row}:${row}`);
  range.setValues([values])
}
```

So how do we test it? Shouldn't we test that it actually writes to the spreadsheet as expected? So let it execute the `setValues`, then read it back in, and check you got the expected result. The author suggests we do not. We just need to test that the call to `setValue` has some side effect, but not the default side effect of actually writing to a spreadsheet. That's where dependency injection comes in.

Let's rewrite our function that incorporates dependency injection, which is just a way of providing some parameters at the end of the function signature. We have to rewrite the body, though, so that we use `Spreadsheet_App` instead of the direct `SpreadsheetApp`, but if this last parameter is not passed, the former will actually be the latter.

```js
function writeRow (sheet, row, values, {Spreadsheet_App=SpreadsheetApp}={}) {
  const sheet = Spreadsheet_App.getActiveSpreadsheet().getSheetByName(sheet);
  const range = sheet.getRange(`A${row}:${row}`);
  range.setValues([values])
}
```

This is a function we can test for the side effect directly.

The idea of how to use it can be represented here. When we call `writeRow`, we hand an object that we mock `ss` which will be the value of `Spreadsheet_App` of the call. 

```js  
function Test() {
  const {description, it, assert} = Utgs.module()
  const ss = SS();  // SS is defined below
  const values = ['a', 'b', 'c'];
  writeRow('any', 3, values, {Spreadsheet_App: ss})
  const actual = ss.state.arr;
  const expected = [values];
  assert.arrayEquals({actual, expected, comment: 'convert to 2d array'});
}
```

We just need some code that makes `const ss = SS()` work so that we can do `ss.state.arr` later and look at what was passed to `setValues`.

```js
// setup the mock for dependency injection
// (these arrow functions without return statements are returning objects,
//   hence the perhaps odd-looking syntax)
const SS = () => {
  const state = {};
  return {
    getSheetByName: () => ({
      getRange: () => ({
        setValues: (arr) => {
          state.arr = [arr];
        }
      })
    })
  };
};
```

That way, our test works as expected.

### Pitfalls

Eagle-eye appscripters might have balked at the code above in the dependency injection example. In fact, the test we created will pass, but when used in a real-life situation, will not work as expected, and will fail with the error:

```
The number of columns in the data does not match the number of columns in the range. The data has 3 but the range has 26.
```

The whole point of testing is to avoid such things! We need to compensate. Let's look into it.

The error is because `setValues` has the behaviour that the specified range must match the values that were passed to it. But we did this:

```js
SpreadsheetApp.getSheetByName(sheet).getRange(`A${row}:${row}`).setValues([values])
```

Notice the `getRange` function is passed the value of `A3:3` which specifies the whole row, rather than just three columns across as it should. 

The fix is fairly easy, we just have to rewrite `writeRow` using the different `getRange` with four values passed to it instead of one:

```js 
function writeRow (sheet, row, values, {Spreadsheet_App=SpreadsheetApp}={}) {
  const sheet = Spreadsheet_App.getActiveSpreadsheet().getSheetByName(sheet)
  const range = sheet.getRange(row, 1, 1, values.length);
  range.setValues([values])
}
```

As we can see, even though we avoid having to use Google's Spreadsheet service in our testing, you still need to pay attention to how they actually work.

## Node

Can also be installed via node, `npm install @classroomtechtools/unittesting`. 

This package has unit tests on itself, which is also useful to check out how to use it.

`npm run test`

## Thanks

Much of the original code came from [GSUnit](https://sites.google.com/site/scriptsexamples/custom-methods/gsunit), with additional refactoring and the additional function assertions.
