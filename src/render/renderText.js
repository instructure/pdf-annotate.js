import setAttributes from '../utils/setAttributes';

export default function renderText(a, s) {
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  setAttributes(text, {
    x: s(a.x),
    y: s(a.y),
    fill: `#${a.color}`,
    fontSize: s(a.size)
  });
  text.innerHTML = a.content;

  return text;
}
