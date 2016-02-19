let keyCase = (key) => key.replace(/[A-Z]/g, (match) => '-' + String.fromCharCode(match.charCodeAt() + 32));

export default function createStyleSheet(blocks) {
  let content = [];
  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');

  for (let selector in blocks) {
    content.push(createRuleSet(selector, blocks[selector]));
  }

  style.appendChild(document.createTextNode(content.join('\n')));

  return style;
}

export function createRuleSet(selector, block) {
  return `${selector} {\n${createDeclarationBlock(block)}\n}`;
}

export function createDeclarationBlock(block) {
  let content = [];

  for (let key in block) {
    content.push(createDeclaration(key, block[key]));
  }

  return content.join('\n');
}

export function createDeclaration(key, value) {
  if (!isNaN(value) && value != 0) {
    value = `${value}px`;
  }

  return `${keyCase(key)}: ${value};`;
}
