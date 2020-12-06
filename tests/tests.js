import {UtgsObject} from '../src/modules/UnitTesting.js';
import test from 'ava';
const {describe, it, assert} = UtgsObject;

/*
  Tests the assert* range of functions
*/
test("assertTrue", t => {
  assert.true_({actual:true});
  t.pass();
});

test("assertFalse", t => {
  assert.false_({actual:false});
  t.pass();
});

test("assertEquals", t => {
  assert.equals({actual:true,expected:true});
  t.pass();
});

test("assertNotEquals", t => {
  assert.notEqual({expected:true,actual:false});
  t.pass();
});

test("assertNull", t => {
  assert.null_({actual:null});
  t.pass();
});

test("assertNotNull2", t => {
  assert.notNull({actual:undefined});
  assert.notNull({actual:0});
  t.pass();
});

test("assertUndefined", t => {
  assert.undefined_({actual:undefined});
  t.pass();
});

test("assertNotUndefined", t => {
  assert.notUndefined({actual:null});
  t.pass();
});

test("assertNaN", t => {
  assert.NaN_({actual:NaN});
  t.pass();
});

test("assetNotNaN", t => {
  assert.notNaN({actual:0});
  t.pass();
});

test("assertObjectEquals", t => {
  assert.objectEquals({expected:{hi:'hi'}, actual:{hi:'hi'}});
  t.pass();
});

test("assertObjectEquals wtesth date", t => {
  const date = new Date();
  assert.objectEquals({expected:{date:date}, actual:{date:date}, comment: "date embedded in object"});
  assert.objectEquals({expected:date, actual:date, comment: "date on tests own"});
  t.pass();
});

test("assertArrayEquals", t => {
  assert.arrayEquals({expected: ['hello', 'world'], actual: ['hello', 'world']});
  t.pass();
});

test("assertEvaluatesToTrue", t => {
  assert.evaluatesToTrue({actual:1});
  assert.evaluatesToTrue({actual:true});
  assert.evaluatesToTrue({actual:'hi'});
  t.pass();
});

test("assertEvaluatesToFalse", t => {
  assert.evaluatesToFalse({actual:0});
  assert.evaluatesToFalse({actual:false});
  assert.evaluatesToFalse({actual:''});
  t.pass();
});

test("assertHashEquals", t => {
  assert.hashEquals({expected:{hi:'hi'}, actual:{hi:'hi'}});
  t.pass();
});

test("assertRoughlyEquals", t => {
  assert.roughlyEquals({expected:1,actual:1.5,tolerance:1});
  t.pass();
});

test("assertContains", t => {
  assert.contains({value: 1, collection:[1, 2]});
  t.pass();
});

test("assertArrayEqualsIgnoringOrder", t => {
  assert.arrayEqualsIgnoringOrder({expected: [2, 1], actual:[1, 2]});
  t.pass();
});

test("assertThrowsError", t => {
  assert.throwsError(function () {
    throw new TypeError("expected error thrown");
  });
  t.pass();
});

test("assertDoesNotThrowError", t => {
  assert.doesNotThrowError(function () {
    "do nothing";
  });
  t.pass();
});

test("assertThrowsTypeError", t => {
  assert.throwsTypeError(function () {
    throw new TypeError("error thrown!");
  });
  t.pass();
});

test("assertThrowsTypeError2", t => {
  assert.throwsTypeError(function () {
    throw new TypeError("error thrown!");
  });
  t.pass();
});

test("assertThrowsRangeError", t => {
  assert.throwsRangeError(function () {
    throw new RangeError("error thrown!");
  });
  t.pass();
});

test("assertTrue fails", t => {
  assert.throwsError(function () {
    assert.true_(false);
  });
  t.pass();
});

test("assertFalse fails", t => {
  assert.throwsError(function () {
    assert.false_(true);
  });
  t.pass();
});

test("assertEquals fails", t => {
  assert.throwsError(function () {
    assert.equals(true, false);
  });
  t.pass();
});

test("assertNotEquals throws error", t => {
  assert.throwsError(function () {
    assert.notEqual(true, true);
  });
  t.pass();
});

test("assertNull throws error", t => {
  assert.throwsError(function () {
    assert.null_('');
  });
  t.pass();
});

test("assertNotNull throws error", t => {
  assert.throwsError(function () {
    assert.notNull(null);
  });
  t.pass();
});

test("assertUndefined throws error", t => {
  assert.throwsError(function () {
    assert.undefined_(null);
  });
  t.pass();
});

test("assertNotUndefined throws error", t => {
  assert.throwsError(function () {
    assert.notUndefined(undefined);
  });
  t.pass();
});

test("assertNaN throws error", t => {
  assert.throwsError(function () {
    assert.NaN_(0);
  });
  t.pass();
});

test("assetNotNaN throws error", t => {
  assert.throwsError(function () {
    assert.notNaN(NaN);
  });
  t.pass();
});

test("assertObjectEquals throws error", t => {
  assert.throwsError(function () {
    assert.objectEquals({hi:'hi'}, {hi:'hi', something:'hi'});
  });
  t.pass();
});

test("assertArrayEquals throws error", t => {
  assert.throwsError(function () {
    assert.arrayEquals(['hello', 'world'], ['hello']);
  });
  t.pass();
});

test("assertEvaluatesToTrue throws error", t => {
  assert.throwsError(function () {
    assert.evaluatesToTrue(false);
  });
  t.pass();
});

test("assertEvaluatesToFalse throws error", t => {
  assert.throwsError(function () {
    assert.evaluatesToFalse(true);
  });
  t.pass();
});

test("assertHashEquals throws error", t => {
  assert.throwsError(function () {
    assert.hashEquals({expected: {hi:'hi'}, actual:{hi:'hello'}});
  });
  t.pass();
});

test("assertRoughlyEquals throws error", t => {
  assert.throwsError(function () {
    assert.roughlyEquals({expected: 1,
                            actual:2,
                            tolerance:1});
  });
  t.pass();
});

test("assertContains throws error", t => {
  assert.throwsError(function () {
    assert.contains(1, [0, 2]);
  });
  t.pass();
});

test("assertArrayEqualsIgnoringOrder throws error", t => {
  assert.throwsError(function () {
    assert.arrayEqualsIgnoringOrder([2, 1], [1, 2, 3]);
  });
  t.pass();
});

test("assertThrowsError fails when non-Error thrown", t => {
  assert.throwsError(function () {
    throw new TypeError("expected error thrown");
  });
  t.pass();
});

test("assertThrowsTypeError fails when non-TypeError thrown", t => {
  assert.throwsError("I am prepared", function () {
    assert.throwsTypeError("throws error", function () {
      throw new Error("wrong error thrown!");
    });
  });
  t.pass();
});

test("assertThrowsTypeError fails when non-ReferenceError thrown", t => {
  assert.throwsError(function () {
    assert.throwsReferenceError(function () {
      throw new TypeError("wrong error thrown!");
    });
  });
  t.pass();
});

test("assertThrowsRangeError fails when non-RangeError thrown", t => {
  assert.throwsError(function () {
    assert.throwsRangeError(function () {
      throw new Error("wrong error thrown!");
    });
  });
  t.pass();
});
