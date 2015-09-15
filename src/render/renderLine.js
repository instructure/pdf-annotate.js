import setAttributes from '../utils/setAttributes';

export default function renderLine(a, s) {
  return a.rectangles.map((r) => {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    setAttributes(line, {
      x1: s(r.x),
      y1: s(r.y),
      x2: s(r.x + r.width),
      y2: s(r.y),
      stroke: '#f00',
      strokeWidth: 1
    });

    return line;
  });
}
