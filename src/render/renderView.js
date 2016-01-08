import arrayFrom from './../utils/arrayFrom';
import renderLine from './renderLine';
import renderPath from './renderPath';
import renderPoint from './renderPoint';
import renderRect from './renderRect';
import renderText from './renderText';

const forEach = Array.prototype.forEach;

function getTranslation(viewport) {
  let x;
  let y;

  // Modulus 360 on the rotation so that we only
  // have to worry about four possible values.
  switch(viewport.rotation % 360) {
    case 0:
      x = y = 0;
      break;
    case 90:
      x = 0;
      y = viewport.width * -1;
      break;
    case 180:
      x = viewport.width * -1;
      y = viewport.height * -1;
      break;
    case 270:
      x = viewport.height * -1;
      y = 0;
      break;
  }

  return { x, y };
}

function transform(node, viewport) {
  let trans = getTranslation(viewport);

  // Let SVG natively transform the element
  node.setAttribute('transform', `scale(${viewport.scale}) rotate(${viewport.rotation}) translate(${trans.x}, ${trans.y})`);

  // Manually adjust x/y for nested SVG nodes
  if (node.nodeName.toLowerCase() === 'svg') {
    node.setAttribute('x', parseInt(node.getAttribute('x'), 10) * viewport.scale);
    node.setAttribute('y', parseInt(node.getAttribute('y'), 10) * viewport.scale);
  }

  // Recurse on child nodes
  forEach.call(node.children, (child) => {
    transform(child, viewport);
  });

  return node;
}

export default function renderView(svg, viewport, data) {
  // Reset the content of the SVG
  svg.innerHTML = ''; 
  svg.setAttribute('data-pdf-annotate-container', true);
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

  data.annotations.forEach((a) => {
    let node;
    switch (a.type) {
      case 'area':
      case 'highlight':
        node = renderRect(a);
        break;
      case 'strikeout':
        node = renderLine(a);
        break;
      case 'point':
        node = renderPoint(a);
        break;
      case 'textbox':
        node = renderText(a);
        break;
      case 'drawing':
        node = renderPath(a);
        break;
    }

    // Node may be either single node, or array of nodes.
    // Ensure we are dealing with an array, then
    // transform, and append each node to the SVG.
    arrayFrom(node).forEach((n) => {
      // If no type was provided for an annotation it will result in node being null.
      // Skip appending/transforming if node doesn't exist.
      if (n) {
        // Set attributes
        n.setAttribute('data-pdf-annotate-id', a.uuid);
        n.setAttribute('data-pdf-annotate-type', a.type);

        svg.appendChild(transform(n, viewport));
      }
    });
  });

  return svg;
}
