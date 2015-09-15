import setAttributes from '../utils/setAttributes';

export default function renderRect(a, s) {
  if (!a.rectangles) {
    a = {rectangles: [a]};
  }

  return a.rectangles.map((r) => {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    setAttributes(rect, {
      x: s(r.x),
      y: s(r.y),
      width: s(r.width),
      height: s(r.height)
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
