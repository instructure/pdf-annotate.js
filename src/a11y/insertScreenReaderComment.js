/**
 * Insert a comment into the DOM to be available by screen reader
 *
 * @param {Object} comment The comment to be inserted
 */
export default function insertScreenReaderComment(comment) {
  if (!comment) {
    return;
  }

  let list = document.querySelector(`#pdf-annotate-screenreader-${comment.annotation} ol`);
  if (list) {
    let item = document.createElement('li');
    item.appendChild(document.createTextNode(`${comment.content}`));
    list.appendChild(item);
  }
}
