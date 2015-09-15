export default function renderLine(a, s) {
  return a.rectangles.map((r) => {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', s(r.x));
    line.setAttribute('y1', s(r.y));
    line.setAttribute('x2', s(r.x + r.width));
    line.setAttribute('y2', s(r.y));
    line.setAttribute('stroke', '#f00');
    line.setAttribute('stroke-width', 1);

    return line;
  });
}
