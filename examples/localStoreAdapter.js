import uuid from '../src/utils/uuid';
let localStoreAdapter = {};
let annotations;

export default localStoreAdapter;

function updateAnnotations(documentId) {
  localStorage.setItem(`${documentId}/annotations`, JSON.stringify(annotations[documentId]));
}

function findAnnotation(documentId, annotationId) {
  let index = -1;
  let ann = annotations[documentId];
  for (let i=0, l=ann.length; i<l; i++) {
    if (ann[i].uuid === annotationId) {
      index = i;
      break;
    }
  }
  return index;
}

localStoreAdapter.getAnnotations = (documentId, pageNumber) => {
  return new Promise((resolve, reject) => {
    if (!annotations) {
      annotations = {};
    }
    annotations[documentId] = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];

    resolve(annotations[documentId].filter((i) => {
      return i.page === pageNumber && i.class === 'Annotation';
    }));
  });
};

localStoreAdapter.getAnnotation = (documentId, annotationId) => {
  return Promise.resolve(annotations[documentId][findAnnotation(documentId, annotationId)]);
};

localStoreAdapter.addAnnotation = (documentId, pageNumber, annotation) => {
  return new Promise((resolve, reject) => {
    annotation.class = 'Annotation';
    annotation.uuid = uuid();
    annotation.page = pageNumber;
  
    annotations[documentId].push(annotation);
    updateAnnotations(documentId);

    resolve(annotation.uuid);
  });
};

localStoreAdapter.editAnnotation = (documentId, annotationId, annotation) => {
  return new Promise((resolve, reject) => {
    annotations[documentId][findAnnotation(documentId, annotationId)] = annotation;
    updateAnnotations(documentId);

    resolve(annotation);
  });
};

localStoreAdapter.deleteAnnotation = (documentId, annotationId) => {
  let index = findAnnotation(...arguments);
  if (index > -1) {
    annotations[documentId].splice(index, 1);
    updateAnnotations(documentId);
  }
};

localStoreAdapter.addComment = (documentId, annotationId, content) => {
  return new Promise((resolve, reject) => {
    let comment = {
      class: 'Comment',
      uuid: uuid(),
      annotation: annotationId,
      content: content
    };

    annotations[documentId].push(comment);
    updateAnnotations(documentId);

    resolve(comment.uuid);
  });
};

localStoreAdapter.deleteComment = (documentId, commentId) => {
  let index = -1;
  let ann = annotations[documentId];
  for (let i=0, l=ann.length; i<l; i++) {
    if (ann[i].uuid === commendId) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    ann.splice(index, 1);
    updateAnnotations(documentId);
  }
};
