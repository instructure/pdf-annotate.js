let localStoreAdapter = {};
let annotations;

export default localStoreAdapter;

localStoreAdapter.getAnnotations = (documentId, pageNumber) => {
  if (!annotations) {
    annotations = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];
  }

  return new Promise((resolve, reject) => {
    resolve(annotations.filter((i) => {
      return i.page === pageNumber;
    }));
  });
};

localStoreAdapter.addAnnotation = (documentId, pageNumber, annotation) => {
  annotation.page = pageNumber;
  annotations.push(annotation);
  localStorage.setItem(`${documentId}/annotations`, JSON.stringify(annotations));
};

