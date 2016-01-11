import uuid from '../src/utils/uuid';
let localStoreAdapter = {};
let annotations;

export default localStoreAdapter;

function updateAnnotations(documentId) {
  localStorage.setItem(`${documentId}/annotations`, JSON.stringify(annotations[documentId]));
}

localStoreAdapter.getAnnotations = (documentId, pageNumber) => {
  if (!annotations) {
    annotations = {};
  }

  annotations[documentId] = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];

  return new Promise((resolve, reject) => {
    resolve(annotations[documentId].filter((i) => {
      return i.page === pageNumber && i.class === 'Annotation';
    }));
  });
};

localStoreAdapter.addAnnotation = (documentId, pageNumber, annotation) => {
  annotation.class = 'Annotation';
  annotation.uuid = uuid();
  annotation.page = pageNumber;
 
  annotations[documentId].push(annotation);
  updateAnnotations(documentId);

  return new Promise((resolve, reject) => {
    resolve(annotation.uuid);
  });
};

localStoreAdapter.deleteAnnotation = (documentId, annotationId) => {
  let index = -1;
  let ann = annotations[documentId];
  for (let i=0, l=ann.length; i<l; i++) {
    if (ann[i].uuid === annotationId) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    ann.splice(index, 1);
    updateAnnotations(documentId);
  }
};

localStoreAdapter.addComment = (documentId, annotationId, content) => {
  let comment = {
    class: 'Comment',
    uuid: uuid(),
    annotation: annotationId,
    content: content
  };

  annotations[documentId].push(comment);
  updateAnnotations(documentId);

  return comment.uuid;
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
