import { parser } from './parser';

function getText() {
  return expect.getState().currentTestName.replace('parser ', '');
}

describe('parser', () => {
  it('Hello <a>world!</a>', () => {
    expect(
      parser(getText(), {
        a: (data: string) => `<b>${data}</b>`,
      })
    ).toEqual('Hello <b>world!</b>');
  });

  it('Hello <br />', () => {
    expect(
      parser(getText(), {
        br: () => '<br />',
      })
    ).toEqual('Hello <br />');
  });

  it('<a>Hello <b>world!</b></a>', () => {
    expect(
      parser(getText(), {
        a: (content: string) => `<c>${content}</c>`,
        b: (content: string) => `<d>${content}</d>`,
      })
    ).toEqual('<c>Hello <d>world!</d></c>');
  });

  it('<a >test</a >', () => {
    expect(
      parser(getText(), { a: (content: string) => `<a>${content}</a>` })
    ).toEqual('<a>test</a>');
  });

  it("'<a>", () => {
    expect(parser(getText())).toEqual('<a>');
  });
});
