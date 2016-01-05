import renderPath from '../src/render/renderPath';

const UI = {};

export default UI;

// Pen stuff
(function () {
  let _penSize;
  let _penColor;
  let _onMouseUp;
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
      _onMouseUp(_penSize, _penColor, lines);
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

  UI.initPen = (penSize = 1, penColor = '000000', onMouseUp = function () {}) => {
    UI.setPen(penSize, penColor);
    _onMouseUp = onMouseUp;
  };

  UI.setPen = (penSize = 1, penColor = '000000') => {
    _penSize = penSize;
    _penColor = penColor;
  };

  UI.enablePen = () => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('selectstart', handleSelectStart);
  };

  UI.disablePen = () => {
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('selectstart', handleSelectStart);
  };
})();
