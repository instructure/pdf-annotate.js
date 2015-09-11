export default function renderRectangle(a) {
  return a.rectangles.map((r) => {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rect.setAttribute('x', r.x);
    rect.setAttribute('y', r.y);
    rect.setAttribute('width', r.width);
    rect.setAttribute('height', r.height);
    rect.setAttribute('fill', '#' + a.color);

    return rect;
  });
}
