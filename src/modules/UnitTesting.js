/** @module Utgs **/

import {ContextManager} from '@classroomtechtools/contextmanager';

const format = () => {
  const config = { defaultTransformString: '<{0}> ({0.typeof_})', loggerObject: (typeof Logger === undefined ? Logger : console), transformers: {} };
  const global = this;

  //  ValueError :: String -> Error
  var ValueError = function (message) {
    var err = new Error(message);
    err.name = 'ValueError';
    return err;
  };

  //  defaultTo :: a,a? -> a
  var defaultTo = function (x, y) {
    return y == null ? x : y;
  };

  //  create :: Object -> String,*... -> String
  var create = function () {

    return function (template) {
      var args = Array.prototype.slice.call(arguments, 1);
      var idx = 0;
      var state = 'UNDEFINED';

      return template.replace(
        /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
        function (match, literal, key, xf) {
          if (literal != null) {
            return literal;
          }
          if (key.length > 0) {
            if (state === 'IMPLICIT') {
              throw ValueError('cannot switch from ' +
                'implicit to explicit numbering');
            }
            state = 'EXPLICIT';
          } else {
            if (state === 'EXPLICIT') {
              throw ValueError('cannot switch from ' +
                'explicit to implicit numbering');
            }
            state = 'IMPLICIT';
            key = String(idx);
            idx += 1;
          }
          var value = defaultTo('', lookup(args, key.split('.')));
          if (xf == null) {
            return value;
          } else if (Object.prototype.hasOwnProperty.call(config.transformers, xf)) {
            return config.transformers[xf](value);
          } else {
            throw ValueError('no transformer named "' + xf + '"');
          }
        }
      );
    };
  };

  var lookup = function (obj, path) {
    if (!/^\d+$/.test(path[0])) {
      path = ['0'].concat(path);
    }
    for (var idx = 0; idx < path.length; idx += 1) {
      var key = path[idx];
      if (typeof obj[key] === 'function')
        obj = obj[key]();
      else
        obj = obj[key];
    }
    return obj;
  };

  Object.defineProperty(Object.prototype, 'stringify', {
    get: function () {
      return function (pretty) {
        pretty = pretty || false;
        if (pretty)
          return (config.pprintNewlines ? "\n" : "") +
            config.defaultTransformString.__format__(JSON.stringify(this, null, config.pprintWhitespace), this);
        else
          return config.defaultTransformString.__format__(JSON.stringify(this), this);
      }
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(Object.prototype, 'typeof_', {
    get: function () {
      var result = typeof this;
      switch (result) {
        case 'string':
          break;
        case 'boolean':
          break;
        case 'number':
          break;
        case 'object':
        case 'function':
          switch (this.constructor) {
            case new String().constructor:
              result = 'String';
              break;
            case new Boolean().constructor:
              result = 'Boolean';
              break;
            case new Number().constructor:
              result = 'Number';
              break;
            case new Array().constructor:
              result = 'Array';
              break;
            case new RegExp().constructor:
              result = 'RegExp';
              break;
            case new Date().constructor:
              result = 'Date';
              break;
            case Function:
              result = 'Function';
              break;
            default:
              result = this.constructor.toString();
              var m = this.constructor.toString().match(/function\s*([^( ]+)\(/);
              if (m)
                result = m[1];
              else
                result = this.constructor.name;   // it's an ES6 class, use name of constructor
              break;
          }
          break;
      }
      return result.substr(0, 1).toUpperCase() + result.substr(1);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(Object.prototype, 'print', {
    get: function () {
      return this.stringify(false);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(Object.prototype, '__print__', {
    get: function () {
      config.loggerObject.log.call(config.loggerObject, this.stringify(false));
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(Object.prototype, 'pprint', {
    get: function () {
      return this.stringify(true);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(Object.prototype, '__pprint__', {
    get: function () {
      config.loggerObject.log.call(config.loggerObject, this.stringify(true));
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(String.prototype, '__log__', {
    get: function () {
      return function () {
        config.loggerObject.log.call(config.loggerObject, this.__format__.apply(this, Array.prototype.slice.call(arguments)));
      }.bind(this);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(String.prototype, '__error__', {
    get: function () {
      return function () {
        config.loggerObject.error.call(config.loggerObject, this.__format__.apply(this, Array.prototype.slice.call(arguments)));
      }.bind(this);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(String.prototype, '__info__', {
    get: function () {
      return function () {
        config.loggerObject.info.call(config.loggerObject, this.__format__.apply(this, Array.prototype.slice.call(arguments)));
      }.bind(this);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(String.prototype, '__warn__', {
    get: function () {
      return function () {
        config.loggerObject.warn.call(config.loggerObject, this.__format__.apply(this, Array.prototype.slice.call(arguments)));
      }.bind(this);
    },
    configurable: true,
    enumerable: false,
  });

  Object.defineProperty(String.prototype, '__format__', {
    get: function () {
      var $format = create(config.transformers);
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this);
        return $format.apply(global, args);
      }
    },
    configurable: true,
    enumerable: false,
  });

}

format();  // setup the .__print__;

/**
 * The building block
 * @ignore
 */
var UtgsUnit = {};  // private methods


var UtgsUnit_UNDEFINED_VALUE;

/**
* Predicate used for testing JavaScript == (i.e. equality excluding type)
*/
UtgsUnit.DOUBLE_EQUALITY_PREDICATE = (var1, var2) => var1 == var2;

/**
* Predicate used for testing JavaScript === (i.e. equality including type)
*/
UtgsUnit.TRIPLE_EQUALITY_PREDICATE = (var1, var2) => var1 === var2;

/*
* Predicate used for testing Javascript date equality
*/
UtgsUnit.DATE_EQUALITY_PREDICATE = (var1, var2) => var1.getTime() === var2.getTime();


/**
* Predicate used for testing whether two obects' toStrings are equal
*/
UtgsUnit.TO_STRING_EQUALITY_PREDICATE = (var1, var2) => var1.toString() === var2.toString();

/**
* Hash of predicates for testing equality by primitive type
*/
UtgsUnit.PRIMITIVE_EQUALITY_PREDICATES = {
  'String': UtgsUnit.DOUBLE_EQUALITY_PREDICATE,
  'Number': UtgsUnit.DOUBLE_EQUALITY_PREDICATE,
  'Boolean': UtgsUnit.DOUBLE_EQUALITY_PREDICATE,
  'Date': UtgsUnit.DATE_EQUALITY_PREDICATE,
  'RegExp': UtgsUnit.TO_STRING_EQUALITY_PREDICATE,
  'Function': UtgsUnit.TO_STRING_EQUALITY_PREDICATE
};

/**
* @param Any object
* @return String - the type of the given object
* @private
*/
UtgsUnit.trueTypeOf = function (something) {
  var result = typeof something;
  try {
    switch (result) {
      case 'string':
        break;
      case 'boolean':
        break;
      case 'number':
        break;
      case 'object':
      case 'function':
        switch (something.constructor) {
          case new String().constructor:
            result = 'String';
            break;
          case new Boolean().constructor:
            result = 'Boolean';
            break;
          case new Number().constructor:
            result = 'Number';
            break;
          case new Array().constructor:
            result = 'Array';
            break;
          case new RegExp().constructor:
            result = 'RegExp';
            break;
          case new Date().constructor:
            result = 'Date';
            break;
          case Function:
            result = 'Function';
            break;
          default:
            const m = something.constructor.toString().match(/function\s*([^( ]+)\(/);
            if (m)
              result = m[1];
            else
              break;
        }
        break;
    }
  }
  finally {
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
    return result;
  }
};

UtgsUnit.displayStringForValue = function (aVar) {
  let result = `<${aVar}>`;
  if (!(aVar === null || aVar === UtgsUnit_UNDEFINED_VALUE)) {
    result += ` (${UtgsUnit.trueTypeOf(aVar)})`;
  }
  return result;
};

UtgsUnit.validateArguments = function (obj, fields) {
  fields = fields.split(' ');
  for (let f = 0; f < fields.length; f++) {
    if (!obj.hasOwnProperty(fields[f])) {
      throw UtgsUnit.AssertionArgumentError(`Assertions needs property ${fields[f]} in obj argument`);
    }
  }
  obj.comment = obj.comment || '';
};

UtgsUnit.checkEquals = (var1, var2) => var1 === var2;

UtgsUnit.checkNotUndefined = (aVar) => aVar !== UtgsUnit_UNDEFINED_VALUE;

UtgsUnit.checkNotNull = (aVar) => aVar !== null;

/**
* All assertions ultimately go through this method.
*/
UtgsUnit.assert = function (comment, booleanValue, failureMessage) {
  if (!booleanValue)
    throw new UtgsUnit.Failure(comment, failureMessage);
};


/**
* @class
* A UtgsUnit.Failure represents an assertion failure (or a call to fail()) during the execution of a Test Function
* @param comment an optional comment about the failure
* @param message the reason for the failure
* @ignore
*/
UtgsUnit.Failure = function (comment, message) {
  /**
  * Declaration that this is a UtgsUnit.Failure
  * @ignore
  */
  this.isUtgsUnitFailure = true;
  /**
  * An optional comment about the failure
  */
  this.comment = comment;
  /**
  * The reason for the failure
  */
  this.UtgsUnitMessage = message;
  /**
  * The stack trace at the point at which the failure was encountered
  */
  // this.stackTrace = UtgsUnit.Util.getStackTrace();

  let failComment = '';
  if (comment != null) failComment = `Comment: ${comment}`;
  message = message || '';
  throw Error(`${failComment}\n\t ---> Error message: ${message}\n    `);
};


/**
* @class
* A UtgsUnitAssertionArgumentError represents an invalid call to an assertion function - either an invalid argument type
* or an incorrect number of arguments
* @param description a description of the argument error
* @ignore
*/
UtgsUnit.AssertionArgumentError = function (description) {
  /**
  * A description of the argument error
  */
  this.description = description;
  throw Error(`Argument error: ${description}`);
};


UtgsUnit.Util = {};
try {
  UtgsUnit.Util.ContextManager = ContextManager;
} catch (err) {
  throw Error("Please install ContextManager")
}

/**
* Standardizes an HTML string by temporarily creating a DIV, setting its innerHTML to the string, and the asking for
* the innerHTML back
* @param html
*/
UtgsUnit.Util.standardizeHTML = function (html) {
  let translator = document.createElement("DIV");
  translator.innerHTML = html;
  return UtgsUnit.Util.trim(translator.innerHTML);
};

/**
* Returns whether the given string is blank after being trimmed of whitespace
* @param string
*/
UtgsUnit.Util.isBlank = function (string) {
  return UtgsUnit.Util.trim(string) == '';
};

/**
* Returns the name of the given function, or 'anonymous' if it has no name
* @param aFunction
*/
UtgsUnit.Util.getFunctionName = function (aFunction) {
  const regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
  if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
    return regexpResult[2];
  }
  return 'anonymous';
};

/**
* Returns the current stack trace
*/
UtgsUnit.Util.getStackTrace = function () {
  let result = '';

  if (arguments.caller !== undefined) {
    for (let a = arguments.caller; a != null; a = a.caller) {
      result += `> ${UtgsUnit.Util.getFunctionName(a.callee)}\n`;
      if (a.caller == a) {
        result += `*`;
        break;
      }
    }
  }
  else { // Mozilla, not ECMA
    // fake an exception so we can get Mozilla's error stack
    try {
      foo.bar;
    }
    catch (exception) {
      const stack = UtgsUnit.Util.parseErrorStack(exception);
      for (let i = 1; i < stack.length; i++) {
        result += `> ${stack[i]}\n`;
      }
    }
  }

  return result;
};

/**
* Returns an array of stack trace elements from the given exception
* @param exception
*/
UtgsUnit.Util.parseErrorStack = function (exception) {
  let stack = [];

  if (!exception || !exception.stack) {
    return stack;
  }

  const stacklist = exception.stack.split('\n');

  for (let i = 0; i < stacklist.length - 1; i++) {
    const framedata = stacklist[i];

    let name = framedata.match(/^(\w*)/)[1];
    if (!name) {
      name = 'anonymous';
    }

    stack[stack.length] = name;
  }
  // remove top level anonymous functions to match IE

  while (stack.length && stack[stack.length - 1] == 'anonymous') {
    stack.length = stack.length - 1;
  }
  return stack;
};

/**
* Strips whitespace from either end of the given string
* @param string
*/
UtgsUnit.Util.trim = function (string) {
  if (string == null)
    return null;

  let startingIndex = 0;
  let endingIndex = string.length - 1;

  const singleWhitespaceRegex = /\s/;
  while (string.substring(startingIndex, startingIndex + 1).match(singleWhitespaceRegex))
    startingIndex++;

  while (string.substring(endingIndex, endingIndex + 1).match(singleWhitespaceRegex))
    endingIndex--;

  if (endingIndex < startingIndex)
    return '';

  return string.substring(startingIndex, endingIndex + 1);
};

UtgsUnit.Util.getKeys = function (obj) {
  let keys = [];
  for (const key in obj) {
    keys.push(key);
  }
  return keys;
};

// private function here that makes context managers
//:

UtgsUnit.Util.inherit = function (superclass, subclass) {
  var x = function () { };
  x.prototype = superclass.prototype;
  subclass.prototype = new x();
};

let _log = [];

/**
 * Holds assertion functions
 */
class assertions {

  /**
  * Checks that two values are equal (using ===)
  * @param {Object} obj
  * @param {any} obj.actual the actual value
  * @param {any} obj.expected the expected value
  * @param {String} [obj.comment] optional, displayed in the case of failure
  * @throws UtgsUnit.Failure if the values are not equal
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  * @example
  * const actual = 1;
  * const expected = 0;
  * assert.equals({actual, expected, comment: 'should be 0'})
  */
  static equals(obj) {
    UtgsUnit.validateArguments(obj, 'expected actual');
    UtgsUnit.assert(obj.comment, UtgsUnit.checkEquals(obj.expected, obj.actual), `Expected ${obj.expected.pprint} but was ${obj.actual.pprint}`);
  }


  /**
  * Checks that the given boolean value is true.
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the given value is not true
  * @throws UtgsUnitInvalidAssertionArgument if the given value is not a boolean or if an incorrect number of arguments is passed
  */
  static assert(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    if (typeof (obj.actual) !== 'boolean')
      throw new UtgsUnit.AssertionArgumentError('Bad argument to assert(boolean)');

    UtgsUnit.assert(obj.comment, obj.actual === true, 'Call to assert(boolean) with false');
  }


  /**
  * Synonym for true_
  * @see #assert
  */
  static true_(obj) {
    this.assert(obj);
  }

  /**
  * Checks that a boolean value is false.
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if value is not false
  * @throws UtgsUnitInvalidAssertionArgument if the given value is not a boolean or if an incorrect number of arguments is passed
  */
  static false_(obj) {
    UtgsUnit.validateArguments(obj, 'actual');

    if (typeof (obj.actual) !== 'boolean')
      throw new UtgsUnit.AssertionArgumentError('Bad argument to false_(boolean)');

    UtgsUnit.assert(obj.comment, obj.actual === false, 'Call to false_(boolean) with true');
  }

  /**
  * Checks that two values are not equal (using !==)
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {Any} obj.expected
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the values are equal
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static notEqual(obj) {
    UtgsUnit.validateArguments(obj, 'expected actual');
    UtgsUnit.assert(obj.comment, obj.expected !== obj.actual, `Expected not to be ${obj.expected}`);
  }

  /**
  * Checks that a value is null
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure  * @throws UtgsUnit.Failure if the value is not null
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static null_(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    UtgsUnit.assert(obj.comment, obj.actual === null, `Expected ${UtgsUnit.displayStringForValue(null)} but was ${obj.actual}`);
  }

  /**
  * Checks that a value is not null
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the value is null
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static notNull(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotNull(obj.actual), `Expected not to be ${UtgsUnit.displayStringForValue(null)}`);
  }

  /**
  * Checks that a value is undefined
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the value is not undefined
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static undefined_(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    UtgsUnit.assert(obj.comment, obj.actual === UtgsUnit_UNDEFINED_VALUE, `Expected ${UtgsUnit.displayStringForValue(UtgsUnit_UNDEFINED_VALUE)} but was ${UtgsUnit.displayStringForValue(obj.actual)}`);
  }

  /**
  * Checks that a value is not undefined
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure  * @throws UtgsUnit.Failure if the value is undefined
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static notUndefined(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotUndefined(obj.actual), `Expected not to be ${UtgsUnit.displayStringForValue(UtgsUnit_UNDEFINED_VALUE)}`);
  }

  /**
  * Checks that a value is NaN (Not a Number)
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure  * @throws UtgsUnit.Failure if the value is a number
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static NaN_(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    UtgsUnit.assert(obj.comment, isNaN(obj.actual), 'Expected NaN');
  }

  /**
  * Checks that a value is not NaN (i.e. is a number)
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {Any} obj.expected
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the value is not a number
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static notNaN(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    UtgsUnit.assert(obj.comment, !isNaN(obj.actual), 'Expected not NaN');
  }

  /**
  * Checks that an object is equal to another using === for primitives and their object counterparts but also desceding
  * into collections and calling objectEquals for each element
  * @param {Object} obj
  * @param {Object} obj.actual
  * @param {Object} obj.expected
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the actual value does not equal the expected value
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static objectEquals(obj) {
    UtgsUnit.validateArguments(obj, 'expected actual');
    if (obj.expected === obj.actual)
      return;

    let isEqual = false;

    const typeOfVar1 = UtgsUnit.trueTypeOf(obj.expected);
    const typeOfVar2 = UtgsUnit.trueTypeOf(obj.actual);
    if (typeOfVar1 == typeOfVar2) {
      const primitiveEqualityPredicate = UtgsUnit.PRIMITIVE_EQUALITY_PREDICATES[typeOfVar1];
      if (primitiveEqualityPredicate) {
        isEqual = primitiveEqualityPredicate(obj.expected, obj.actual);
      } else {
        const expectedKeys = UtgsUnit.Util.getKeys(obj.expected).sort().join(", ");
        const actualKeys = UtgsUnit.Util.getKeys(obj.actual).sort().join(", ");
        if (expectedKeys != actualKeys) {
          UtgsUnit.assert(obj.comment, false, `Expected keys ${expectedKeys} but found ${actualKeys}`);
        }
        for (const i in obj.expected) {
          this.objectEquals({
            comment: `{obj.comment} nested ${typeOfVar1} key ${i}\n`,
            expected: obj.expected[i],
            actual: obj.actual[i]
          });
        }
        isEqual = true;
      }
    }
    UtgsUnit.assert(obj.comment, isEqual, `Expected ${UtgsUnit.displayStringForValue(obj.expected)} but was ${UtgsUnit.displayStringForValue(obj.actual)}`);
  }

  /**
  * Checks that an array is equal to another by checking that both are arrays and then comparing their elements using objectEquals
  * @param {Object} obj
  * @param {Array} obj.actual
  * @param {Array} obj.expected
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the actual value does not equal the expected value
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  * @example
  * const actual = [1, 2, 3, 4];
  * const expected = [1, 2, 3, 4];
  * assert.arrayEquals({actual, expected});
  */
  static arrayEquals(obj) {
    UtgsUnit.validateArguments(obj, 'expected actual');
    if (UtgsUnit.trueTypeOf(obj.expected) != 'Array' || UtgsUnit.trueTypeOf(obj.actual) != 'Array') {
      throw new UtgsUnit.AssertionArgumentError('Non-array passed to arrayEquals');
    }
    this.objectEquals(obj);
  }

  /**
  * Checks that a value evaluates to true in the sense that value == true
  * @param {Object} obj
  * @param {Any} obj.actual
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the actual value does not evaluate to true
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static evaluatesToTrue(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    if (!obj.actual)
      this.fail(obj.comment);
  }

  /**
  * Checks that a value evaluates to false in the sense that value == false
  * @param {Object} obj
  * @param {Any} obj.actual the value
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the actual value does not evaluate to true
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static evaluatesToFalse(obj) {
    UtgsUnit.validateArguments(obj, 'actual');
    if (obj.actual)
      this.fail(obj.comment);
  }

  /**
  * Checks that a hash is has the same contents as another by iterating over the expected hash and checking that each
  * key's value is present in the actual hash and calling equals on the two values, and then checking that there is
  * no key in the actual hash that isn't present in the expected hash.
  * @param {Object} obj
  * @param {Object} obj.actual - value of the actual hash
  * @param {Object} obj.expected - value of the expected hash
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the actual hash does not evaluate to true
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static hashEquals(obj) {
    UtgsUnit.validateArguments(obj, 'actual expected');
    for (const key in obj.expected) {
      this.notUndefined({
        comment: `Expected hash had key ${key} that was not found in actual`,
        actual: obj.actual[key]
      });
      this.equals({
        comment: `Value for key ${key} mismatch -- expected = ${obj.expected[key]} actual = ${obj.actual[key]}`,
        expected: obj.expected[key],
        actual: obj.actual[key]
      }
      );
    }
    for (var key in obj.actual) {
      this.notUndefined({ comment: `Actual hash had key ${key} that was not expected`, actual: obj.expected[key] });
    }
  }

  /**
  * Checks that two value are within a tolerance of one another
  * @param {Object} obj
  * @param {Number} obj.actual a value
  * @param {Number} obj.expected another value
  * @param {Number} obj.tolerance the tolerance
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the two values are not within tolerance of each other
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments is passed
  */
  static roughlyEquals(obj) {
    UtgsUnit.validateArguments(obj, 'actual expected tolerance');
    this.true_({
      comment: `Expected ${obj.expected} but got ${obj.actual} which was more than ${obj.tolerance}  away`,
      actual: Math.abs(obj.expected - obj.actual) < obj.tolerance
    });
  }

  /**
  * Checks that a collection contains a value by checking that collection.indexOf(value) is not -1
  * @param {Object} obj
  * @param {String|Array} obj.collection - any object with indexOf method
  * @param {Any} obj.value
  * @throws UtgsUnit.Failure if the collection does not contain the value
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static contains(obj) {
    UtgsUnit.validateArguments(obj, 'value collection');
    this.true_({
      comment: `Expected ${obj.collection} to contain ${obj.value}`,
      actual: obj.collection.indexOf(obj.value) != -1
    });
  }

  /**
  * Checks that two arrays have the same contents, ignoring the order of the contents
  * @param {Object} obj
  * @param {Array} obj.actual
  * @param {Array} obj.expected
  * @param {String} [obj.comment] - displayed in the case of failure
  * @throws UtgsUnit.Failure if the two arrays contain different contents
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static arrayEqualsIgnoringOrder(obj) {
    UtgsUnit.validateArguments(obj, 'expected actual');

    const notEqualsMessage = `Expected arrays ${obj.expected} and ${obj.actual} to be equal (ignoring order)`;
    const notArraysMessage = `Expected arguments ${obj.expected} and ${obj.actual} to be arrays`;

    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotNull(obj.expected), notEqualsMessage);
    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotNull(obj.actual), notEqualsMessage);

    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotUndefined(obj.expected.length), notArraysMessage);
    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotUndefined(obj.expected.join), notArraysMessage);
    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotUndefined(obj.actual.length), notArraysMessage);
    UtgsUnit.assert(obj.comment, UtgsUnit.checkNotUndefined(obj.actual.join), notArraysMessage);

    UtgsUnit.assert(obj.comment, UtgsUnit.checkEquals(obj.expected.length, obj.actual.length), notEqualsMessage);

    for (let i = 0; i < obj.expected.length; i++) {
      let found = false;
      for (let j = 0; j < obj.actual.length; j++) {
        try {
          this.objectEquals({
            comment: notEqualsMessage,
            expected: obj.expected[i],
            actual: obj.actual[j]
          });
          found = true;
        } catch (ignored) {
        }
      }
      UtgsUnit.assert(obj.comment, found, notEqualsMessage);
    }
  }

  /**
  * Checks that a function throws an error - general function
  * @ignore
  * @param {Object} obj
  * @param {Error} obj.expectedError
  * @param {String} [obj.comment] - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if expected error was not thrown
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static throws(obj, func) {
    UtgsUnit.validateArguments(obj, 'expectedError');
    if (typeof (func) !== 'function') throw UtgsUnit.Failure("Must have function");
    let caughtError = false;

    try {
      func.call();
    } catch (err) {
      caughtError = true;
      UtgsUnit.assert(obj.comment, err instanceof obj.expectedError, `Expected thrown error to be of type ${(obj.expectedError.name || obj.expectedError.toString())}`);
    }

    if (!caughtError)
      throw UtgsUnit.Failure("No error was thrown, expecting error of type '" + obj.expectedError.name);
  }

  /**
  * Checks that a function does NOT throw an error - general function
  * @param {Object} obj
  * @param {Error} obj.unexpectedError
  * @param {String} [obj.comment] - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if the unexected error is thrown
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static doesNotThrow(obj, func) {
    UtgsUnit.validateArguments(obj, 'unexpectedError');
    if (typeof (func) !== 'function') throw UtgsUnit.Failure("Must have function");

    try {
      func.call();
    } catch (err) {
      UtgsUnit.assert(obj.comment, err instanceof obj.unexpectedError, "Did not expect to throw error of type " + obj.unexpectedError.name);
    }
  }

  /**
  * Checks that a function throws an error
  * @param {String} comment - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if it does not throw an Error
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static throwsError(comment, func) {
    const saved = this.result;

    if (arguments.length == 1) {
      func = comment;
      comment = '';
    }
    let ret = this.throws.call(this, { expectedError: Error }, func);
    if (this.result == false && saved == true) {
      this.result = true;
    }
    return ret;
  }

  /**
  * Checks that a function throws an error
  * @param {String} comment - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if an Error is thrown
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static doesNotThrowError(comment, func) {
    if (arguments.length == 1) {
      func = comment;
      comment = '';
    }
    return this.doesNotThrow.call(this, { unexpectedError: Error }, func);
  }

  /**
  * Checks that a function throws an error
  * @param {String} comment - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if a Type error is not thrown
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static throwsTypeError(comment, func) {
    if (arguments.length == 1) {
      func = comment;
      comment = '';
    }
    return this.throws.call(this, { expectedError: TypeError }, func);
  }

  /**
  * Checks that a function throws an error
  * @param {String} comment - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if Range error is not thrown
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static throwsRangeError(comment, func) {
    if (arguments.length == 1) {
      func = comment;
      comment = '';
    }
    return this.throws.call(this, {
      expectedError: RangeError,
      comment: comment
    }, func);
  }

  /**
  * Checks that a function throws an error
  * @param {String} comment - displayed in the case of failure
  * @param {Function} func - any function, will be invoked
  * @throws UtgsUnit.Failure if Reference error is not thrown
  * @throws UtgsUnitInvalidAssertionArgument if an incorrect number of arguments are passed
  */
  static throwsReferenceError(comment, func) {
    if (arguments.length == 1) {
      func = comment;
      comment = '';
    }
    return this.throws.call(this, {
      comment: comment,
      expectedError: ReferenceError
    }, func);
  }

  /**
   * @ignore
   */
  static describe(description, body) {
    let ctx = new UtgsUnit.Util.ContextManager();
    ctx.head = function () {
      _log = [description];
    };
    ctx.tail = function () {
      _log.push('\n');
      config.loggerObject.log(_log.join('\n'));
      _log = [];
    };
    ctx.with(body);
  }

  /**
   * @ignore
   */
  static withContext(body, options) {
    let ctx = new UtgsUnit.Util.ContextManager(options);
    ctw.with(body);
  }

  /**
   * @ignore
   */
  static it(shouldMessage, body) {
    let ctx = new UtgsUnit.Util.ContextManager();
    ctx.head = function (param) {
      this.result = "\t✔ " + shouldMessage;
    };
    ctx.error = function (err, obj) {
      this.result = `\t✘ ${shouldMessage} -> ${err.stack}`;
      return null;  // swallow
    };
    ctx.tail = function (obj) {
      _log.push(this.result);
    };

    //go
    ctx.with(body);
  }

  /**
   * @ignore
   */
  static skip(shouldMessage, body) {
    _log("\t☛ " + shouldMessage + '... SKIPPED');
  }

  /**
   * @ignore
   */
  static fail(failureMessage) {
    throw new UtgsUnit.Failure("Call to fail()", failureMessage);
  }

  static log (value) {
    _log.push(value);
  }
}

/**
 * @static
 * @property {Describe} describe - the first level block
 * @property {It} it - the second level block
 * @property {module:Utgs~assert} assert - Object with assertions
 */
export const UtgsObject = {
  describe: function (name, func) {
    return assertions.describe(name, func);
  },
  it: function (name, func) {
    return assertions.it(name, func);
  },
  assert: assertions
};
