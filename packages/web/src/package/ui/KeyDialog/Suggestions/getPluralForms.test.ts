import { getPluralForms } from './getPluralForms';

const PLURAL = "{count, plural, one {# '{'item'}'} other {# items}}";

describe('getPluralForms', () => {
  it('splits a plural suggestion into its forms', () => {
    const forms = getPluralForms({
      text: PLURAL,
      keyIsPlural: true,
      icuPlaceholders: true,
    });
    expect(forms?.parameter).toBe('count');
    expect(forms?.variants).toEqual({ one: "# '{'item'}'", other: '# items' });
  });

  it('unescapes the forms of a project without ICU placeholders', () => {
    const forms = getPluralForms({
      text: PLURAL,
      keyIsPlural: true,
      icuPlaceholders: false,
    });
    expect(forms?.variants).toEqual({ one: '# {item}', other: '# items' });
  });

  it('gives no forms for a key that is not plural', () => {
    expect(
      getPluralForms({
        text: PLURAL,
        keyIsPlural: false,
        icuPlaceholders: true,
      })
    ).toBeUndefined();
  });

  it('gives no forms for malformed ICU', () => {
    expect(
      getPluralForms({
        text: '{count, plural, one {',
        keyIsPlural: true,
        icuPlaceholders: true,
      })
    ).toBeUndefined();
  });

  it('gives no forms for text that is not a plural', () => {
    expect(
      getPluralForms({
        text: 'not a plural',
        keyIsPlural: true,
        icuPlaceholders: true,
      })
    ).toBeUndefined();
  });
});
