const UPPER_REGEX = /[A-Z]/g;

// Don't convert these attributes from camelCase to hyphenated-attributes
const BLACKLIST = [
  'viewBox'
];

let keyCase = (key) => {
  if (BLACKLIST.indexOf(key) === -1) {
    key = key.replace(UPPER_REGEX, (match) => '-' + String.fromCharCode(match.charCodeAt() + 32));
  }
  return key;
}

export default function setAttributes(node, attributes) {
  Object.keys(attributes).forEach((key) => {
    node.setAttribute(keyCase(key), attributes[key]);
  });
}
