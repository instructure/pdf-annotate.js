import setAttributes from '../utils/setAttributes';

/**
 * Create SVGTextElement from an annotation definition.
 * This is used for anntations of type `textbox`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGTextElement} A text to be rendered
 */
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
