import arrayFrom from '../../src/utils/arrayFrom';
import { equal } from 'assert';

describe('utils::arrayFrom', function () {
  it('should create an array from non array', function () {
    let arr = arrayFrom('a');
    equal(arr[0], 'a');
    equal(arr.length, 1);
  });

  it('should return array if already array', function () {
    let arr = arrayFrom([1, 2, 3]);
    equal(arr[0], 1);
    equal(arr[1], 2);
    equal(arr[2], 3);
    equal(arr.length, 3);
  });
});

