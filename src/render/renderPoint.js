import setAttributes from '../utils/setAttributes';

// TODO: Finish comment bubble
export default function renderPoint(a, s) {
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  let ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  setAttributes(rect, {
    x: s(a.x),
    y: s(a.y),
    rx: 1,
    ry: 1,
    width: s(25),
    height: s(25),
    stroke: '#000',
    fill: '#ff0'
  });

  setAttributes(ellipse, {
    cx: s(a.x + 12),
    cy: s(a.y + 10),
    rx: s(9),
    ry: s(7),
    stroke: '#000',
    fill: '#fff'
  });

  // let d = [
  //   `M${a.x + 8} ${a.y + 16}`,
  //    `A 2 1, 0, 0, 1, ${a.x + 4} ${a.y + 20}`,
  //    `L ${a.x + 6} ${a.y + 15} Z`
  // ];
  // setAttributes(path, {
  //   d: d.join(', '),
  //   stroke: '#000',
  //   fill: '#fff'
  // });
  
  return [rect, ellipse];
}
