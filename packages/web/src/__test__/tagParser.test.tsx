import { FormatSimple, TolgeeCore, TolgeeInstance } from '@tolgee/core';
import { TagParser } from '../typedIndex';

function textElement(name: string): any {
  return (content: string) => `<${name}>${content}</${name}>`;
}

describe('tag parser', () => {
  let tolgee: TolgeeInstance;
  beforeEach(() => {
    tolgee = TolgeeCore()
      .use(FormatSimple())
      .init({
        language: 'en',
        staticData: {
          en: {
            simple: '<a>hello</a>',
            nested: '<a>hello <b>world</b></a>',
            with_param: '<a>{param}</a>',
            invalid: '<a href="test">{param}</a>',
            unclosed: '<a>test</b>',
          },
        },
      });
  });

  it('manages simple element', () => {
    tolgee.addPlugin(TagParser());
    expect(tolgee.t('simple', { a: textElement('A') })).toEqual('<A>hello</A>');
  });

  it('manages nested element', () => {
    tolgee.addPlugin(TagParser());
    expect(
      tolgee.t('nested', { a: textElement('A'), b: textElement('B') })
    ).toEqual('<A>hello <B>world</B></A>');
  });

  it('manages param', () => {
    tolgee.addPlugin(TagParser());
    expect(
      tolgee.t('with_param', { a: textElement('A'), param: 'inside' })
    ).toEqual('<A>inside</A>');
  });

  it('escapes param', () => {
    tolgee.addPlugin(TagParser());
    expect(
      tolgee.t('with_param', { a: textElement('A'), param: '<a>inside</a>' })
    ).toEqual('<A><a>inside</a></A>');
  });

  it('keeps invalid tag', () => {
    tolgee.addPlugin(TagParser());
    expect(
      tolgee.t('invalid', { a: textElement('A'), param: 'inside' })
    ).toEqual('<a href="test">inside</a>');
  });

  it('escapes invalid html', () => {
    tolgee.addPlugin(TagParser({ escapeHtml: true }));
    expect(
      tolgee.t('invalid', { a: textElement('A'), param: 'inside' })
    ).toEqual('&lt;a href=&quot;test&quot;&gt;inside&lt;/a&gt;');
  });

  it('escapes html in params', () => {
    tolgee.addPlugin(TagParser({ escapeHtml: true }));
    expect(
      tolgee.t('with_param', { a: textElement('A'), param: '<a>inside</a>' })
    ).toEqual('<A>&lt;a&gt;inside&lt;/a&gt;</A>');
  });

  it('escapes unclosed tag', () => {
    tolgee.addPlugin(TagParser({ escapeHtml: true }));
    expect(
      tolgee.t('unclosed', { a: textElement('A'), b: textElement('B') })
    ).toEqual('&lt;a&gt;test&lt;/b&gt;');
  });
});
