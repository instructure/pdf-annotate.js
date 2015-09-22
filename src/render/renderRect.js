import setAttributes from '../utils/setAttributes';

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
      rect.setAttribute('fill', `#${a.color}`);
    } else {
      setAttributes(rect, {
        stroke: '#f00',
        fill: 'none'
      });
    }

    return rect;
  });
}
