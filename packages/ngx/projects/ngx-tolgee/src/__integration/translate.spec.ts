import '@testing-library/jest-dom';
import { render, RenderResult, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { Tolgee, DevTools } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockCoreFetch } from '@tolgee/testing/fetchMock';

import { provideTolgee } from '../lib/provide-tolgee';
import { TranslateService } from '../lib/translate.service';
import { AttributeTranslatedComponent } from './fixtures/translated/attribute-translated.component';
import { PipeTranslatedComponent } from './fixtures/translated/pipe-translated.component';
import { wait } from '@tolgee/testing/wait';

describe.each([
  {
    name: 'translate attribute',
    component: AttributeTranslatedComponent,
  },
  {
    name: 'translate pipe',
    component: PipeTranslatedComponent,
  },
])('$name', ({ component }) => {
  let fixture: RenderResult<any>;
  let service: TranslateService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCoreFetch().enableMocks();

    fixture = await render(component, {
      providers: [
        provideTolgee(() =>
          Tolgee().use(DevTools()).use(FormatIcu()).init({
            apiUrl: 'http://localhost',
            apiKey: 'dummyApiKey',
            language: 'cs',
            fallbackLanguage: 'en',
          })
        ),
      ],
    });

    service = TestBed.inject(TranslateService);
  });

  it('wraps translation correctly', () => {
    expect(screen.queryByTestId('hello_world')).toContainHTML('Ahoj světe!');
    expect(screen.queryByTestId('hello_world')).toHaveAttribute('_tolgee');
  });

  it('works with no wrap', () => {
    expect(screen.queryByTestId('hello_world_no_wrap')).toContainHTML(
      'Ahoj světe!'
    );
    expect(screen.queryByTestId('hello_world_no_wrap')).not.toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with parameters', () => {
    expect(screen.queryByTestId('peter_dogs')).toContainHTML('Petr má 5 psů.');
    expect(screen.queryByTestId('peter_dogs')).toHaveAttribute('_tolgee');
  });

  it('works with default value', () => {
    expect(screen.queryByTestId('non_existent')).toContainHTML('Non existent');
    expect(screen.queryByTestId('non_existent')).toHaveAttribute('_tolgee');
  });

  it('works with tags', () => {
    expect(screen.queryByTestId('with_tags')).toContainHTML(
      'Tento <b>text <i>je</i> formátovaný</b>'
    );
    expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
  });

  it('works with tags disabled', () => {
    const content = 'Tento <b>text <i>je</i> formátovaný</b>';
    expect(screen.queryByTestId('with_tags_disabled')).toHaveTextContent(
      content
    );
    expect(screen.queryByTestId('with_tags_disabled')).not.toContainHTML(
      content
    );
  });

  it('empty key returns nothing', () => {
    expect(screen.queryByTestId('empty_key')).toContainHTML('');
  });

  it('undefined key returns nothing', () => {
    expect(screen.queryByTestId('undefined_key')).toContainHTML('');
  });

  it('null key returns nothing', () => {
    expect(screen.queryByTestId('null_key')).toContainHTML('');
  });

  it('works with language prop', () => {
    expect(screen.queryByTestId('with_language_prop')).toContainHTML(
      'Hello world!'
    );
    expect(screen.queryByTestId('with_language_prop')).toHaveAttribute(
      '_tolgee'
    );
  });

  it('works with value props', () => {
    expect(screen.queryByTestId('with_value_props')).toContainHTML(
      'Hello world!'
    );
    expect(screen.queryByTestId('with_value_props')).toHaveAttribute('_tolgee');
  });

  it('works with changing key', async () => {
    expect(screen.queryByTestId('with_changing_key')).toContainHTML(
      'Ahoj světe!'
    );
    fixture.fixture.componentRef.setInput('key', 'mouse');
    fixture.detectChanges();
    await wait(100);
    expect(fixture.fixture.componentInstance.key()).toBe('mouse');
    expect(screen.queryByTestId('with_changing_key')).toContainHTML('myš');
    expect(screen.queryByTestId('with_changing_key')).toHaveAttribute(
      '_tolgee'
    );
  });

  describe('language switch', () => {
    beforeEach(async () => {
      await service.tolgee.changeLanguage('en');
      fixture.detectChanges();
    });

    it('changes translation with tags', () => {
      expect(screen.queryByTestId('with_tags')).toContainHTML(
        'This <b>text <i>is</i> formatted</b>'
      );
      expect(screen.queryByTestId('with_tags')).toHaveAttribute('_tolgee');
    });
  });
});
