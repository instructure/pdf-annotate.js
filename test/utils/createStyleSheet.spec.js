import createStyleSheet from '../../src/utils/createStyleSheet';
import { equal } from 'assert';

describe('utils::createStyleSheet', function () {
  it('should process blocks', function () {
    let style = createStyleSheet({
      '.foo .bar': {
        padding: 0,
        fontSize: 12,
        border: '1px solid red'
      },
      'a:hover': {
        textDecoration: 'underline'
      }
    });

    equal(style.innerHTML, `.foo .bar {
padding: 0;
font-size: 12px;
border: 1px solid red;
}
a:hover {
text-decoration: underline;
}`);
  });
});
