import { parser } from './parser';

function getText() {
  return expect.getState().currentTestName.replace('parser ', '');
}

function textElement(name: string) {
  return (content: string) => `<${name}>${content}</${name}>`;
}

function objectElement(name: string) {
  return (content: string) => ({ name, content });
}

describe('parser', () => {
  it('Text <a>element</a>!', () => {
    expect(
      parser(getText(), {
        a: textElement('A'),
      })
    ).toEqual('Text <A>element</A>!');
  });

  it('Object <a>element</a>!', () => {
    expect(
      parser(getText(), {
        a: objectElement('A'),
      })
    ).toEqual(['Object ', { name: 'A', content: 'element' }, '!']);
  });

  it('Ignored <a>element</a>!', () => {
    expect(parser(getText())).toEqual('Ignored <a>element</a>!');
  });

  it('Text <br /> self closing', () => {
    expect(
      parser(getText(), {
        br: textElement('BR'),
      })
    ).toEqual('Text <BR>undefined</BR> self closing');
  });

  it('Object <br /> self closing', () => {
    expect(
      parser(getText(), {
        br: objectElement('BR'),
      })
    ).toEqual(['Object ', { name: 'BR', content: undefined }, ' self closing']);
  });

  it('Ignored <br /> self closing', () => {
    expect(parser(getText())).toEqual('Ignored <br /> self closing');
  });

  it('Text <a>nested <b>element</b> and</a> more', () => {
    expect(
      parser(getText(), {
        a: textElement('A'),
        b: textElement('B'),
      })
    ).toEqual('Text <A>nested <B>element</B> and</A> more');
  });

  it('Object <a>nested <b>element</b> and</a> more', () => {
    expect(
      parser(getText(), {
        a: objectElement('A'),
        b: objectElement('B'),
      })
    ).toEqual([
      'Object ',
      {
        name: 'A',
        content: ['nested ', { name: 'B', content: 'element' }, ' and'],
      },
      ' more',
    ]);
  });

  it('Ignored <a>nested <b>element</b> and</a> more', () => {
    expect(parser(getText())).toEqual(
      'Ignored <a>nested <b>element</b> and</a> more'
    );
  });

  it('<a >test</a >', () => {
    expect(parser(getText(), { a: textElement('A') })).toEqual('<A>test</A>');
  });

  it('<a>ignored when no matching parameter</a>', () => {
    expect(parser(getText())).toEqual(
      '<a>ignored when no matching parameter</a>'
    );
  });

  it('Ignored when no function param <a> tag', () => {
    expect(parser(getText())).toEqual('Ignored when no function param <a> tag');
  });

  it('Ignored when unclosed <a> tag', () => {
    expect(parser(getText(), { a: textElement('A') })).toEqual(
      'Ignored when unclosed <a> tag'
    );
  });

  it('Text handles white at allowed places <a >test</a >', () => {
    expect(parser(getText(), { a: textElement('A') })).toEqual(
      'Text handles white at allowed places <A>test</A>'
    );
  });

  it('Ignored with spaces <a >test</a >', () => {
    expect(parser(getText())).toEqual('Ignored with spaces <a >test</a >');
  });

  it('Ignored partly when crossed <a>first <b>second</a> third</b>', () => {
    expect(
      parser(getText(), {
        a: textElement('A'),
        b: textElement('B'),
      })
    ).toEqual('Ignored partly when crossed <a>first <B>second</a> third</B>');
  });

  it('Ignored with params <a href="/">test</a>', () => {
    expect(parser(getText(), { a: textElement('A') })).toEqual(
      'Ignored with params <a href="/">test</a>'
    );
  });
});
