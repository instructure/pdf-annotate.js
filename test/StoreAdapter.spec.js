import StoreAdapter from '../src/StoreAdapter';
import { equal } from 'assert';

function testExpectedError(callback) {
  return function () {
    let error = null;
    try {
      callback();
    } catch (e) {
      error = e;
    }

    equal(error instanceof Error, true);
  }
}

describe('StoreAdapter', function () {
  it('should error by default when calling getAnnotations', testExpectedError(function () {
    StoreAdapter.getAnnotations();
  }));
  
  it('should error by default when calling getAnnotation', testExpectedError(function () {
    StoreAdapter.getAnnotation();
  }));
 
  it('should error by default when calling addAnnotation', testExpectedError(function () {
    StoreAdapter.addAnnotation();
  }));
     
  it('should error by default when calling editAnnotation', testExpectedError(function () {
    StoreAdapter.editAnnotation();
  }));

  it('should error by default when calling deleteAnnotation', testExpectedError(function () {
    StoreAdapter.deleteAnnotation();
  }));

  it('should error by default when calling getComments', testExpectedError(function () {
    StoreAdapter.getComments();
  }));

  it('should error by default when calling addComment', testExpectedError(function () {
    StoreAdapter.addComment();
  }));

  it('should error by default when calling deleteComment', testExpectedError(function () {
    StoreAdapter.deleteComment();
  }));
});
