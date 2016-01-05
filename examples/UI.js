import renderPath from '../src/render/renderPath';

const UI = {};

export default UI;

// Pen stuff
let _penSize;
let _penColor;

UI.initPen = (penSize = 1, penColor = '000000', onMouseUp = function () {}) => {
  UI.setPen(penSize, penColor);

  let path;
  let lines;
  
  function handleMouseDown() {
    path = null;
    lines = [];

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseUp() {
    if (lines.length > 1) {
      onMouseUp(lines);
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e) {
    // TODO adjust the offset of the x/y coords
    lines.push([e.clientX, e.clientY]);

    if (lines.length <= 1) {
      return;
    }

    if (path) {
      svg.removeChild(path);
    }

    path = renderPath({
      color: _penColor,
      width: _penSize,
      lines
    });

    svg.appendChild(path);
  }

  function handleSelectStart(e) {
    e.preventDefault();
    return false;
  }

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('selectstart', handleSelectStart);
};

UI.setPen = (penSize = 1, penColor = '000000') => {
  _penSize = penSize;
  _penColor = penColor;
};
