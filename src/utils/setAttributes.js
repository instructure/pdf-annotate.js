const UPPER_REGEX = /[A-Z]/g;
let keyCase = (key) => {
  return key.replace(UPPER_REGEX, (match) => '-' + String.fromCharCode(match.charCodeAt() + 32));
}

export default function setAttributes(node, attributes) {
  Object.keys(attributes).forEach((key) => {
    node.setAttribute(keyCase(key), attributes[key]);
  });
}
