import renderPath from '../../src/render/renderPath';

let path;
let lines;
let svg = document.getElementById('svg');

function handleMouseDown() {
  path = null;
  lines = [];
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp() {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e) {
  lines.push([e.clientX, e.clientY]);

  if (lines.length <= 1) {
    return;
  }

  if (path) {
    svg.removeChild(path);
  }

  path = renderPath({
    color: '000',
    lines
  });

  svg.appendChild(path);
}

document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('selectstart', function (e) {
  e.preventDefault();
  return false;
});
