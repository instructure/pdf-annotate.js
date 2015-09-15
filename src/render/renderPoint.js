// TODO: Finish comment bubble
export default function renderPoint(a, s) {
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  let ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  rect.setAttribute('x', s(a.x));
  rect.setAttribute('y', s(a.y));
  rect.setAttribute('rx', 1);
  rect.setAttribute('ry', 1);
  rect.setAttribute('width', s(25));
  rect.setAttribute('height', s(25));
  rect.setAttribute('stroke', '#000');
  rect.setAttribute('fill', '#ff0');

  ellipse.setAttribute('cx', s(a.x + 12));
  ellipse.setAttribute('cy', s(a.y + 10));
  ellipse.setAttribute('rx', s(9));
  ellipse.setAttribute('ry', s(7));
  ellipse.setAttribute('stroke', '#000');
  ellipse.setAttribute('fill', '#fff');

  // let d = [
  //   `M${a.x + 8} ${a.y + 16}`,
  //    `A 2 1, 0, 0, 1, ${a.x + 4} ${a.y + 20}`,
  //    `L ${a.x + 6} ${a.y + 15} Z`
  // ];
  // path.setAttribute('d', d.join(', '));
  // path.setAttribute('stroke', '#000');
  // path.setAttribute('fill', '#fff');
  
  return [rect, ellipse];
}
