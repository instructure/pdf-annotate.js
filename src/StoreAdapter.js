import abstractFunction from './utils/abstractFunction';

// Adapter should never be invoked publicly
let StoreAdapter = {
  /**
   * Get all the annotations for a given document and page number.
   *
   * @param {String} documentId The ID for the document the annotations belong to
   * @param {Number} pageNumber The number of the page the annotations belong to
   * @return {Promise}
   */
  getAnnotations: (documentId, pageNumber) => { abstractFunction('getAnnotations'); },

  /**
   * Get the definition for a specific annotation.
   *
   * @param {String} documentId The ID for the document the annotation belongs to
   * @param {String} annotationId The ID for the annotation
   * @return {Promise}
   */
  getAnnotation: (documentId, annotationId) => { abstractFunction('getAnnotation'); },
  
  /**
   * Add an annotation
   *
   * @param {String} documentId The ID for the document to add the annotation to
   * @param {String} pageNumber The page number to add the annotation to
   * @param {Object} annotation The definition for the new annotation
   * @return {Promise}
   */
  addAnnotation: (documentId, pageNumber, annotation) => { abstractFunction('addAnnotation'); },
  
  /**
   * Edit an annotation
   *
   * @param {String} documentId The ID for the document
   * @param {String} pageNumber the page number of the annotation
   * @param {Object} annotation The definition of the modified annotation
   * @return {Promise}
   */
  editAnnotation: (documentId, pageNumber, annotation) => { abstractFunction('editAnnotation'); },
  
  /**
   * Delete an annotation
   *
   * @param {String} documentId The ID for the document
   * @param {String} annotationId The ID for the annotation
   * @return {Promise}
   */
  deleteAnnotation: (documentId, annotationId) => { abstractFunction('deleteAnnotation'); },
  
  /**
   * Get all the comments for an annotation
   *
   * @param {String} documentId The ID for the document
   * @param {String} annotationId The ID for the annotation
   * @return {Promise}
   */
  getComments: (documentId, annotationId) => { abstractFunction('getComments'); },
  
  /**
   * Add a new comment
   *
   * @param {String} documentId The ID for the document
   * @param {String} annotationId The ID for the annotation
   * @param {Object} content The definition of the comment
   * @return {Promise}
   */
  addComment: (documentId, annotationId, content) => { abstractFunction('addComment'); },
  
  /**
   * Delete a comment
   *
   * @param {String} documentId The ID for the document
   * @param {String} commentId The ID for the comment
   * @return {Promise}
   */
  deleteComment: (documentId, commentId) => { abstractFunction('deleteComment'); }
};

export default StoreAdapter;
