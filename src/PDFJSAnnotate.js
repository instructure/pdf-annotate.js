import StoreAdapter from './StoreAdapter';
import render from './render';
import UI from './UI';

export default {
  /**
   * StoreAdapter is an abstract object that needs to be defined
   * so that PDFJSAnnotate knows how to communicate with your server.
   */
  StoreAdapter,

  /**
   * UI is a helper for instrumenting UI interactions for creating,
   * editing, and deleting annotations in the browser.
   */
  UI,

  /**
   * Render the annotations for a page in the PDF Document
   *
   * @param {SVGElement} svg The SVG element that annotations should be rendered to
   * @param {PageViewport} viewport The PDFPage.getViewport data
   * @param {Object} data The StoreAdapter.getAnnotations data
   * @return {Promise}
   */
  render,

  /**
   * Convenience method for getting annotation data
   *
   * @alias StoreAdapter.getAnnotations
   * @param {String} documentId The ID of the document
   * @param {String} pageNumber The page number
   * @return {Promise}
   */
  getAnnotations(documentId, pageNumber) {
    return this.StoreAdapter.getAnnotations(...arguments);
  }
}
