import uuid from '../src/utils/uuid';
let localStoreAdapter = {};
let annotations;

export default localStoreAdapter;

function getAnnotations(documentId) {
  if (!annotations) {
    annotations = {};
  }
  if (!annotations[documentId]) {
    annotations[documentId] = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];
  }
  return annotations[documentId];
}

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
    resolve(getAnnotations(documentId).filter((i) => {
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

    resolve(annotation);
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
  return new Promise((resolve, reject) => {
    let index = findAnnotation(documentId, annotationId);
    if (index > -1) {
      annotations[documentId].splice(index, 1);
      updateAnnotations(documentId);
    }

    resolve(true);
  });
};

localStoreAdapter.getComments = (documentId, annotationId) => {
  return new Promise((resolve, reject) => {
    resolve(getAnnotations(documentId).filter((i) => {
      return i.class === 'Comment' && i.annotation === annotationId;
    }));
  });
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

    resolve(comment);
  });
};

localStoreAdapter.deleteComment = (documentId, commentId) => {
  return new Promise((resolve, reject) => {
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

    resolve(true);
  });
};
