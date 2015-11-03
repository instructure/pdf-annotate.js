import objectAssign from 'object-assign';
import uuid from '../src/utils/uuid';

const TEMPLATE = {
  class: 'Annotation',
  uuid: uuid(),
  page: 1,
  owner: 'admin'
};

export let mock = (type, def = {}) => objectAssign({}, TEMPLATE, {type}, def);

export let mockText = (x, y, content) => mock('textbox', {
  x,
  y,
  width: 100,
  height: 50,
  size: 20,
  color: '000',
  content
});
