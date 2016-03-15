import createStyleSheet from '../../src/utils/createStyleSheet';
import { equal } from 'assert';

describe('utils::createStyleSheet', function () {
  it('should create style node', function () {
    let style = createStyleSheet({});
    
    equal(style.nodeName, 'STYLE');
    equal(style.getAttribute('type'), 'text/css');
  });

  it('should add px to non-zero numbers', function () {
    let style = createStyleSheet({
      input: {
        padding: 10,
        margin: 0
      }
    });

    equal(style.innerHTML,
`input {
padding: 10px;
margin: 0;
}`
    );
  });

  it('should add hyphens to camelCase properties', function () {
    let style = createStyleSheet({
      '.foo .bar': {
        fontSize: 12
      },
      'a:hover': {
        textDecoration: 'underline'
      }
    });

    equal(style.innerHTML,
`.foo .bar {
font-size: 12px;
}
a:hover {
text-decoration: underline;
}`
    );
  });
});
