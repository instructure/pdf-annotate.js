let hyphenate = (prop) => prop.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());

export default function createStyleSheet(blocks) {
  let style = document.createElement('style');
  let text = Object.keys(blocks).map((selector) => processRuleSet(selector, blocks[selector])).join('\n');
  
  style.setAttribute('type', 'text/css');
  style.appendChild(document.createTextNode(text));

  return style;
}

function processRuleSet(selector, block) {
  return `${selector} {\n${processDeclarationBlock(block)}\n}`;
}

function processDeclarationBlock(block) {
  return Object.keys(block).map((prop) => processDeclaration(prop, block[prop])).join('\n');
}

function processDeclaration(prop, value) {
  if (!isNaN(value) && value != 0) {
    value = `${value}px`;
  }

  return `${hyphenate(prop)}: ${value};`;
}
