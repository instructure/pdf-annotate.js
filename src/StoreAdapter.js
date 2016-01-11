import abstractFunction from './utils/abstractFunction';

// Adapter should never be invoked publicly
let StoreAdapter = {
  getAnnotations: abstractFunction('getAnnotations'),
  addAnnotation: abstractFunction('addAnnotation'),
  editAnnotation: abstractFunction('editAnnotation'),
  deleteAnnotation: abstractFunction('deleteAnnotation'),
  addComment: abstractFunction('addComment'),
  deleteComment: abstractFunction('deleteComment')
};

export default StoreAdapter;
