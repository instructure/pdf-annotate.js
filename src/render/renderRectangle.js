export default function renderRectangle(a) {
  if (!a.rectangles) {
    a = {rectangles: [a]};
  }

  return a.rectangles.map((r) => {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rect.setAttribute('x', r.x);
    rect.setAttribute('y', r.y);
    rect.setAttribute('width', r.width);
    rect.setAttribute('height', r.height);
    
    if (a.color) {
      rect.setAttribute('fill', '#' + a.color);
    } else {
      rect.setAttribute('stroke', '#f00');
      rect.setAttribute('fill', 'none');
    }

    return rect;
  });
}
