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
      return i.page === pageNumber;
    }));
  });
};

localStoreAdapter.addAnnotation = (documentId, pageNumber, annotation) => {
  annotation.page = pageNumber;
  annotations[documentId].push(annotation);
  updateAnnotations(documentId);
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
