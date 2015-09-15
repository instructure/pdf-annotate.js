import setAttributes from '../utils/setAttributes';

export default function renderPath(a, s) {
  let d = [];
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  for (let i=0, l=a.lines.length; i<l; i++) {
    var p1 = a.lines[i];
    var p2 = a.lines[i+1];
    if (p2) {
      d.push(`M${s(p1[0])} ${s(p1[1])} ${s(p2[0])} ${s(p2[1])}`);
    }
  }
  
  setAttributes(path, {
    d: `${d.join(',')}Z`,
    stroke: `#${a.color}`,
    fill: 'none'
  });

  return path;
}
