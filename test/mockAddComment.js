import uuid from '../src/utils/uuid';

export default (spy) => {
  return function (documentId, annotationId, content) {
    spy(documentId, annotationId, content);
    return new Promise((resolve, reject) => {
      let comment = {
        class: 'Comment',
        uuid: uuid(),
        annotation: annotationId,
        content: content
      };

      resolve(comment);
    });
  };
}
