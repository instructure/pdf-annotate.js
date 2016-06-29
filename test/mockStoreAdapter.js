import StoreAdapter from '../src/adapter/StoreAdapter';
import uuid from '../src/utils/uuid';

export default (annotations = []) => {
  function getAnnotations() {
    return annotations;
  }

  function findAnnotation(annotationId) {
    let index = -1;
    for (let i=0, l=annotations.length; i<l; i++) {
      if (annotations[i].uuid === annotationId) {
        index = i;
        break;
      }
    }
    return index;
  }

  return new StoreAdapter({
    getAnnotations(documentId, pageNumber) {
      return new Promise((resolve, reject) => {
        let annotations = getAnnotations().filter((i) => {
          return i.page === pageNumber && i.class === 'Annotation';
        });

        resolve({
          documentId,
          pageNumber,
          annotations
        });
      });
    },

    getAnnotation(documentId, annotationId) {
      return Promise.resolve(annotations[findAnnotation(annotationId)]);
    },

    addAnnotation(documentId, pageNumber, annotation) {
      return new Promise((resolve, reject) => {
        annotation.class = 'Annotation';
        annotation.uuid = uuid();
        annotation.page = pageNumber;
      
        annotations.push(annotation);

        resolve(annotation);
      });
    },

    editAnnotation(documentId, annotationId, annotation) {
      return new Promise((resolve, reject) => {
        annotations[findAnnotation(annotationId)] = annotation;

        resolve(annotation);
      });
    },

    deleteAnnotation(documentId, annotationId) {
      return new Promise((resolve, reject) => {
        let index = findAnnotation(annotationId);
        if (index > -1) {
          annotations.splice(index, 1);
        }

        resolve(true);
      });
    },

    getComments(documentId, annotationId) {
      return new Promise((resolve, reject) => {
        resolve(getAnnotations().filter((i) => {
          return i.class === 'Comment' && i.annotation === annotationId;
        }));
      });
    },

    addComment(documentId, annotationId, content) {
      return new Promise((resolve, reject) => {
        let comment = {
          class: 'Comment',
          uuid: uuid(),
          annotation: annotationId,
          content: content
        };

        annotations.push(comment);

        resolve(comment);
      });
    },

    deleteComment(documentId, commentId) {
      return new Promise((resolve, reject) => {
        let index = -1;
        let ann = annotations;
        for (let i=0, l=ann.length; i<l; i++) {
          if (ann[i].uuid === commendId) {
            index = i;
            break;
          }
        }

        if (index > -1) {
          ann.splice(index, 1);
        }

        resolve(true);
      });
    }

  });
}
