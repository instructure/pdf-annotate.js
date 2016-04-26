import setAttributes from '../utils/setAttributes';

/**
 * Create SVGRectElements from an annotation definition.
 * This is used for anntations of type `area` and `highlight`.
 *
 * @param {Object} a The annotation definition
 * @return {Array} An Array of all rects to be rendered
 */
export default function renderRect(a) {
  if (!a.rectangles) {
    a = {rectangles: [a]};
  }

  return a.rectangles.map((r) => {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    setAttributes(rect, {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height
    });
    
    if (a.color) {
      setAttributes(rect, {
        fill: `#${a.color}`,
        fillOpacity: 0.2
      });
    } else {
      setAttributes(rect, {
        stroke: '#f00',
        fill: 'none'
      });
    }

    return rect;
  });
}
