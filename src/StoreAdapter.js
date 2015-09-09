import abstractFunction from './utils/abstractFunction';

// Adapter should never be invoked publicly
let StoreAdapter = {
  getAnnotations: abstractFunction('getAnnotations'),
  addAnnotation: abstractFunction('addAnnotation'),
  editAnnotation: abstractFunction('editAnnotation'),
  deleteAnnotation: abstractFunction('deleteAnnotation')
};

export default StoreAdapter;
