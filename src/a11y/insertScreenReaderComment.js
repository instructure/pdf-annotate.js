/**
 * Insert a comment into the DOM to be available by screen reader
 *
 * @param {Object} comment The comment to be inserted
 */
export default function insertScreenReaderComment(comment) {
  let list = document.querySelector(`#pdf-annotate-screenreader-${comment.annotation} [role="list"]`);
  if (list) {
    let item = document.createElement('div');
    item.setAttribute('role', 'listitem');
    item.appendChild(document.createTextNode(`comment ${list.children.length + 1}: ${comment.content}`));
    list.appendChild(item);
  }
}
