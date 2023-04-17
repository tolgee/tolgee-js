import { FormatSimple, TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { HtmlEscaper } from '../typedIndex';

describe('tag parser', () => {
  let tolgee: TolgeeInstance;
  beforeEach(() => {
    tolgee = TolgeeCore()
      .use(HtmlEscaper())
      .use(FormatSimple())
      .init({
        language: 'en',
        staticData: {
          en: {
            simple: '<a>hello</a>',
            nested: '<a>hello <b>world</b></a>',
            with_param: '<a>{param}</a>',
            invalid: '<a href="test">{param}</a>',
          },
        },
      });
  });

  it('manages simple element', () => {
    expect(tolgee.t('simple')).toEqual('&lt;a&gt;hello&lt;/a&gt;');
  });

  it('manages nested element', () => {
    expect(tolgee.t('nested')).toEqual(
      '&lt;a&gt;hello &lt;b&gt;world&lt;/b&gt;&lt;/a&gt;'
    );
  });

  it('manages params', () => {
    expect(tolgee.t('with_param', { param: '<a>inside</a>' })).toEqual(
      '&lt;a&gt;&lt;a&gt;inside&lt;/a&gt;&lt;/a&gt;'
    );
  });

  it('manages complex html', () => {
    expect(tolgee.t('invalid', { param: 'inside' })).toEqual(
      '&lt;a href=&quot;test&quot;&gt;inside&lt;/a&gt;'
    );
  });
});
