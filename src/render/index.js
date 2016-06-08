import PDFJSAnnotate from '../PDFJSAnnotate';
import appendChild from './appendChild';
import {
  pointIntersectsRect,
  scaleUp,
  scaleDown
} from '../UI/utils'; 

/**
 * Render the response from PDFJSAnnotate.StoreAdapter.getAnnotations to SVG
 *
 * @param {SVGElement} svg The SVG element to render the annotations to
 * @param {Object} viewport The page viewport data
 * @param {Object} data The response from PDFJSAnnotate.StoreAdapter.getAnnotations
 * @return {SVGElement} The SVG element that was rendered to
 */
export default function render(svg, viewport, data) {
  // Reset the content of the SVG
  svg.innerHTML = ''; 
  svg.setAttribute('data-pdf-annotate-container', true);
  svg.setAttribute('data-pdf-annotate-viewport', JSON.stringify(viewport));
  svg.removeAttribute('data-pdf-annotate-document');
  svg.removeAttribute('data-pdf-annotate-page');

  // If there's no data nothing can be done
  if (!data) {
    return svg;
  }

  svg.setAttribute('data-pdf-annotate-document', data.documentId);
  svg.setAttribute('data-pdf-annotate-page', data.pageNumber);
  
  // Make sure annotations is an array
  if (!Array.isArray(data.annotations) || data.annotations.length === 0) {
    return svg;
  }

  // Append annotation to svg
  data.annotations.forEach((a) => {
    appendChild(svg, a, viewport);
  });

  // Enable a11y
  // TODO this should def not use timeout, but is needed to wait for PDFJSText.render
  setTimeout(function () {
    renderScreenReaderHints(data.annotations);
  }, 5000);

  return svg;
}

// ----------------------------------------
//
// TODO
// From here down is logic for making annotations detectable by screen readers.
// This should all be in it's own file for easier code readability and testing.
//
// ----------------------------------------

/**
 * Insert hints into the DOM for screen readers.
 *
 * @param {Array} annotations The annotations that hints are inserted for
 */
function renderScreenReaderHints(annotations) {
  // Sort annotations first by y, then by x.
  // This allows hints to be injected in the order they appear,
  // which makes numbering them easier.
  function sortByPoint(a, b) {
    if (a.y < b.y) {
      return a.x - b.x;
    } else {
      return 1;
    }
  }

  // Sort annotation by it's first rectangle
  function sortByRectPoint(a, b) {
    return sortByPoint(a.rectangles[0], b.rectangles[0]);
  }

  // Arrange supported types and associated sort methods
  let types = {
    'highlight': sortByRectPoint,
    'strikeout': sortByRectPoint,
    'textbox': sortByPoint,
    'point': sortByPoint
  };

  // Insert hints for each type
  Object.keys(types).forEach((type) => {
    let sortBy = types[type];
    annotations
      .filter((a) => a.type === type)
      .sort(sortBy)
      .forEach((a, i) => insertScreenReaderHint(a, i + 1));
  });
}

/**
 * Insert a hint into the DOM for screen readers for a specific annotation.
 *
 * @param {Object} annotation The annotation to insert a hint for
 * @param {Number} num The number of the annotation out of all annotations of the same type
 */
function insertScreenReaderHint(annotation, num) {
  if (annotation.type === 'highlight' || annotation.type === 'strikeout') {
    let rects = annotation.rectangles;
    let first = rects[0];
    let last = rects[rects.length - 1];

    insertElementWithinElement(
      createScreenReaderOnly(`Begin ${annotation.type} annotation ${num}`),
      first.x, first.y, annotation.page, true
    );

    insertElementWithinElement(
      createScreenReaderOnly(`End ${annotation.type} annotation ${num}`),
      last.x + last.width, last.y, annotation.page, false
    );
  } else if (annotation.type === 'textbox' || annotation.type === 'point') {
    let text = annotation.type === 'textbox' ? ` (content: ${annotation.content})` : '';
    insertElementWithinChildren(
      createScreenReaderOnly(`${annotation.type} annotation ${num}${text}`),
      annotation.x, annotation.y, annotation.page
    );
  }
}

/**
 * Insert an element at a point within the document.
 * This algorithm will try to insert between elements if possible.
 * It will however use `insertElementWithinElement` if it is more accurate.
 *
 * @param {Element} el The element to be inserted
 * @param {Number} x The x coordinate of the point
 * @param {Number} y The y coordinate of the point
 * @param {Number} pageNumber The page number to limit elements to
 * @return {Boolean} True if element was able to be inserted, otherwise false
 */
function insertElementWithinChildren(el, x, y, pageNumber) {
  // Try and use most accurate method of inserting within an element
  if (insertElementWithinElement(el, x, y, pageNumber, true)) {
    return true;
  }

  // Fall back to inserting between elements
  let svg = document.querySelector(`svg[data-pdf-annotate-page="${pageNumber}"]`);
  let rect = svg.getBoundingClientRect();
  let nodes = [...svg.parentNode.querySelectorAll('.textLayer > div')];

  y = scaleUp(svg, {y}).y + rect.top;
  x = scaleUp(svg, {x}).x + rect.left;

  // Find the best node to insert before
  for (let i=0, l=nodes.length; i<l; i++) {
    let n = nodes[i];
    let r = n.getBoundingClientRect();
    if (y <= r.top) {
      n.parentNode.insertBefore(el, n);
      return true;
    }
  }

  return false;
}

/**
 * Insert an element at a point within the document.
 * This algorithm will only insert within an element amidst it's text content.
 *
 * @param {Element} el The element to be inserted
 * @param {Number} x The x coordinate of the point
 * @param {Number} y The y coordinate of the point
 * @param {Number} pageNumber The page number to limit elements to
 * @param {Boolean} insertBefore Whether the element is to be inserted before or after x
 * @return {Boolean} True if element was able to be inserted, otherwise false
 */
function insertElementWithinElement(el, x, y, pageNumber, insertBefore) {
  const OFFSET_ADJUST = 2;

  // If inserting before adjust `x` by looking for element a few px to the right
  // Otherwise adjust a few px to the left
  // This is to allow a little tolerance by searching within the box, instead
  // of getting a false negative by testing right on the border.
  x = x + (OFFSET_ADJUST * (insertBefore ? 1 : -1));

  let node = textLayerElementFromPoint(x, y + OFFSET_ADJUST, pageNumber);
  if (!node) {
    return false;
  }
  
  // Now that node has been found inverse the adjustment for `x`.
  // This is done to accomodate tolerance by cutting off on the outside of the
  // text boundary, instead of missing a character by cutting off within.
  x = x + (OFFSET_ADJUST * (insertBefore ? -1 : 1));

  let svg = document.querySelector(`svg[data-pdf-annotate-page="${pageNumber}"]`);
  let left = scaleDown(svg, {left: node.getBoundingClientRect().left}).left - svg.getBoundingClientRect().left;
  let temp = node.cloneNode(true);
  let head = temp.innerHTML.split('');
  let tail = [];

  // Insert temp off screen
  temp.style.position = 'absolute';
  temp.style.top = '-10000px';
  temp.style.left = '-10000px';
  document.body.appendChild(temp);

  while (head.length) {
    // Don't insert within HTML tags
    if (head[head.length - 1] === '>') {
      while(head.length) {
        tail.unshift(head.pop());
        if (tail[0] === '<') {
          break;
        }
      }
    }
    
    // Check if width of temp based on current head value satisfies x
    temp.innerHTML = head.join('');
    let width = scaleDown(svg, {width: temp.getBoundingClientRect().width}).width;
    if (left + width <= x) {
      break;
    }
    tail.unshift(head.pop());
  }
  
  // Update original node with new markup, including element to be inserted
  node.innerHTML = head.join('') + el.outerHTML + tail.join('');
  temp.parentNode.removeChild(temp);

  return true;
}

/**
 * Get a text layer element at a given point on a page
 *
 * @param {Number} x The x coordinate of the point
 * @param {Number} y The y coordinate of the point
 * @param {Number} pageNumber The page to limit elements to
 * @return {Element} First text layer element found at the point
 */
function textLayerElementFromPoint(x, y, pageNumber) {
  let svg = document.querySelector(`svg[data-pdf-annotate-page="${pageNumber}"]`);
  let rect = svg.getBoundingClientRect();
  y = scaleUp(svg, {y}).y + rect.top;
  x = scaleUp(svg, {x}).x + rect.left;
  return [...svg.parentNode.querySelectorAll('.textLayer [data-canvas-width]')].filter((el) => {
    return pointIntersectsRect(x, y, el.getBoundingClientRect());
  })[0];
}

/**
 * Create a node that is only visible to screen readers
 *
 * @param {String} content The text content that should be read by screen reader
 * @return {Element} An Element that is only visible to screen readers
 */
function createScreenReaderOnly(content) {
  let node = document.createElement('div');
  let text = document.createTextNode(content);
  node.appendChild(text);
  node.style.position = 'absolute';
  node.style.left = '-10000px';
  node.style.top = 'auto';
  node.style.width = '1px';
  node.style.height = '1px';
  node.style.overflow = 'hidden';
  return node;
}
