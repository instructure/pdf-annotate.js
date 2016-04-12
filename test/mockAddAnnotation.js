import uuid from '../src/utils/uuid';

export default (spy) => {
  return function (documentId, pageNumber, annotation) {
    spy(documentId, pageNumber, annotation);
    return new Promise((resolve, reject) => {
      annotation.class = 'Annotation';
      annotation.uuid = uuid();
      annotation.page = pageNumber;

      resolve(annotation);
    });
  };
}
