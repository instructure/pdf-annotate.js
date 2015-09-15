export default function renderText(a, s) {
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  text.setAttribute('x', s(a.x));
  text.setAttribute('y', s(a.y));
  text.setAttribute('font-size', s(a.size));
  text.setAttribute('fill', `#${a.color}`);
  text.innerHTML = a.content;

  return text;
}
