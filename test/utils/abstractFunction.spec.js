import abstractFunction from '../../src/utils/abstractFunction';
import { equal } from 'assert';

describe('utils::abstractFunction', function () {
  it('should throw when not implemented', function () {
    let fn = abstractFunction('fn');
    let err;

    try {
      fn();
    } catch (e) {
      err = e;
    }

    equal(typeof err, 'object');
    equal(err.message, 'fn is not implemented');
  });
});
