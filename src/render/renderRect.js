export default function renderRect(a, s) {
  if (!a.rectangles) {
    a = {rectangles: [a]};
  }

  return a.rectangles.map((r) => {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rect.setAttribute('x', s(r.x));
    rect.setAttribute('y', s(r.y));
    rect.setAttribute('width', s(r.width));
    rect.setAttribute('height', s(r.height));

    
    if (a.color) {
      rect.setAttribute('fill', '#' + a.color);
    } else {
      rect.setAttribute('stroke', '#f00');
      rect.setAttribute('fill', 'none');
    }

    return rect;
  });
}
