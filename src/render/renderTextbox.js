export default function renderTextbox(a) {
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  text.setAttribute('x', a.x);
  text.setAttribute('y', a.y);
  text.setAttribute('font-size', a.size);
  text.setAttribute('fill', `#${a.color}`);
  text.innerHTML = a.content;

  return text;
}
