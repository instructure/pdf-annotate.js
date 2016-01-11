import setAttributes from '../utils/setAttributes';

export default function renderText(a) {
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

  setAttributes(text, {
    x: a.x,
    y: a.y + parseInt(a.size, 10),
    fill: `#${a.color}`,
    fontSize: a.size
  });
  text.innerHTML = a.content;

  return text;
}
