import PDFJSAnnotate from '../src/PDFJSAnnotate';
import { equal } from 'assert';

PDFJSAnnotate.StoreAdapter = {
  getAnnotations: (documentId, pageNumber) => {
    return Promise.resolve([
      {
        type: 'point',
        x: 0,
        y: 0
      }
    ]);
  }
};

describe('PDFJSAnnotate', function () {
  it('should get anotations', function (done) {
    PDFJSAnnotate.getAnnotations().then((annotations) => {
      equal(annotations.annotations[0].type, 'point');
      done();
    });
  });
  
  it('should inject documentId and pageNumber', function (done) {
    PDFJSAnnotate.getAnnotations('document-id', 'page-number').then((annotations) => {
      equal(annotations.documentId, 'document-id');
      equal(annotations.pageNumber, 'page-number');
      done();
    });
  });
});

