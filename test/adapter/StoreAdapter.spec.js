import StoreAdapter from '../../src/adapter/StoreAdapter';
import { addEventListener, removeEventListener } from '../../src/UI/event';
import mockStoreAdapter from '../mockStoreAdapter';
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
  describe('abstract', function () {
    let adapter;

    beforeEach(function () {
      adapter = new StoreAdapter();
    });

    it('should error by default when calling getAnnotations', testExpectedError(function () {
      adapter.getAnnotations();
    }));
    
    it('should error by default when calling getAnnotation', testExpectedError(function () {
      adapter.getAnnotation();
    }));
  
    it('should error by default when calling addAnnotation', testExpectedError(function () {
      adapter.addAnnotation();
    }));
      
    it('should error by default when calling editAnnotation', testExpectedError(function () {
      adapter.editAnnotation();
    }));

    it('should error by default when calling deleteAnnotation', testExpectedError(function () {
      adapter.deleteAnnotation();
    }));

    it('should error by default when calling getComments', testExpectedError(function () {
      adapter.getComments();
    }));

    it('should error by default when calling addComment', testExpectedError(function () {
      adapter.addComment();
    }));

    it('should error by default when calling deleteComment', testExpectedError(function () {
      adapter.deleteComment();
    }));
  });

  describe('events', function () {
    let adapter;
    let handleAnnotationAdd = () => {};
    let handleAnnotationEdit = () => {};
    let handleAnnotationDelete = () => {};
    let handleCommentAdd = () => {};
    let handleCommentDelete = () => {};

    beforeEach(function () {
      adapter = mockStoreAdapter();
    });

    afterEach(function () {
      removeEventListener('annotation:add', handleAnnotationAdd);
      removeEventListener('annotation:edit', handleAnnotationEdit);
      removeEventListener('annotation:delete', handleAnnotationDelete);
      removeEventListener('comment:add', handleCommentAdd);
      removeEventListener('comment:delete', handleCommentDelete);
    });

    it('should emit annotation:add', function (done) {
      let called = false;
      handleAnnotationAdd = () => {
        called = true;
      };
      addEventListener('annotation:add', handleAnnotationAdd);
      adapter.addAnnotation(12345, 1, {type: 'foo'});

      setTimeout(() => {
        equal(called, true);
        done();
      });
    });
    
    it('should emit annotation:edit', function (done) {
      let called = false;
      handleAnnotationEdit = () => {
        called = true;
      };
      addEventListener('annotation:edit', handleAnnotationEdit);
      adapter.editAnnotation(12345, 67890, {type: 'bar'});

      setTimeout(() => {
        equal(called, true);
        done();
      });
    });
    
    it('should emit annotation:delete', function (done) {
      let called = false;
      handleAnnotationDelete = () => {
        called = true;
      };
      addEventListener('annotation:delete', handleAnnotationDelete);
      adapter.deleteAnnotation(12345, 67890);

      setTimeout(() => {
        equal(called, true);
        done();
      });
    });

    it('should emit comment:add', function (done) {
      let called = false;
      handleCommentAdd = () => {
        called = true;
      };
      addEventListener('comment:add', handleCommentAdd);
      adapter.addComment(12345, 67890, 'hello');

      setTimeout(() => {
        equal(called, true);
        done();
      });
    });
    
    it('should emit comment:delete', function (done) {
      let called = false;
      handleCommentDelete = () => {
        called = true;
      };
      addEventListener('comment:delete', handleCommentDelete);
      adapter.deleteComment(12345, 67890);

      setTimeout(() => {
        equal(called, true);
        done();
      });
    });
  });
});
