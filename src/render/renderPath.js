export default function renderPath(a, s) {
  let d = [];
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  for (let i=0, l=a.lines.length; i<l; i++) {
    var p1 = a.lines[i];
    var p2 = a.lines[i+1];
    if (p2) {
      d.push('M' + s(p1[0]) + ' ' + s(p1[1]) + ' ' + s(p2[0]) + ' ' + s(p2[1]));
    }
  }
  
  path.setAttribute('d', d.join(',') + 'Z');
  path.setAttribute('stroke', '#' + a.color);
  path.setAttribute('fill', 'none');

  return path;
}
