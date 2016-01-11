import abstractFunction from './utils/abstractFunction';

// Adapter should never be invoked publicly
let StoreAdapter = {
  getAnnotations: (documentId, pageNumber) => { abstractFunction('getAnnotations'); },
  getAnnotation: (documentId, annotationId) => { abstractFunction('getAnnotation'); },
  addAnnotation: (documentId, pageNumber, annotation) => { abstractFunction('addAnnotation'); },
  editAnnotation: (documentId, pageNumber, annotation) => { abstractFunction('editAnnotation'); },
  deleteAnnotation: (documentId, annotationId) => { abstractFunction('deleteAnnotation'); },
  addComment: (documentId, annotationId, content) => { abstractFunction('addComment'); },
  deleteComment: (documentId, commentId) => { abstractFunction('deleteComment'); }
};

export default StoreAdapter;
