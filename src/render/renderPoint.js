import setAttributes from '../utils/setAttributes';

export default function renderPoint(a, s) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let d = 'M499.968 214.336q-113.832 0 -212.877 38.781t-157.356 104.625 -58.311 142.29q0 62.496 39.897 119.133t112.437 97.929l48.546 27.9 -15.066 53.568q-13.392 50.778 -39.06 95.976 84.816 -35.154 153.45 -95.418l23.994 -21.204 31.806 3.348q38.502 4.464 72.54 4.464 113.832 0 212.877 -38.781t157.356 -104.625 58.311 -142.29 -58.311 -142.29 -157.356 -104.625 -212.877 -38.781zm499.968 285.696q0 97.092 -66.96 179.397t-181.908 130.014 -251.1 47.709q-39.06 0 -80.91 -4.464 -110.484 97.65 -256.68 135.036 -27.342 7.812 -63.612 12.276h-2.79q-8.37 0 -15.066 -5.859t-8.928 -15.345v-.558q-1.674 -2.232 -.279 -6.696t1.116 -5.58 2.511 -5.301l3.348 -5.022t3.906 -4.743 4.464 -5.022q3.906 -4.464 17.298 -19.251t19.251 -21.204 17.298 -22.041 18.135 -28.458 15.066 -32.922 14.508 -42.408q-87.606 -49.662 -138.105 -122.76t-50.499 -156.798q0 -97.092 66.96 -179.397t181.908 -130.014 251.1 -47.709 251.1 47.709 181.908 130.014 66.96 179.397z';

  setAttributes(svg, {
    width: s(20),
    height: s(20),
    x: s(a.x + 2),
    y: s(a.y + 1)
  });
  svg.setAttribute('viewBox', '0 0 1000 1000');

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

  path.setAttribute('d', d);
  path.setAttribute('stroke', '#000');
  // path.setAttribute('fill', '#fff');

  svg.appendChild(path);

  return [rect, svg];
}
