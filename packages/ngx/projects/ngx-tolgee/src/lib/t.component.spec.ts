jest.mock('@tolgee/core');
jest.dontMock('./t.component');
jest.dontMock('./translate.service');

import { TComponent } from './t.component';
import {
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/angular';
import { TranslateService } from './translate.service';
import { createMock } from '@testing-library/angular/jest-utils';

describe('T component', function () {
  let translateSer;
  let fixture: RenderResult<any>;
  let element;
  let langChangeUnsubscribeMock = jest.fn();
  let langChangeSubscribeMock = jest.fn(() => ({
    unsubscribe: langChangeUnsubscribeMock,
  }));
  let translationChangeUnsubscribeMock = jest.fn();
  let translationChangeSubscribeMock = jest.fn(() => ({
    unsubscribe: translationChangeUnsubscribeMock,
  }));

  beforeEach(async () => {
    jest.clearAllMocks();
    translateSer = createMock(TranslateService);
    (translateSer as any).onLangChange = {
      subscribe: langChangeSubscribeMock,
    };
    (translateSer as any).onTranslationChange = {
      subscribe: translationChangeSubscribeMock,
    };
    (translateSer as any).getSafe = jest.fn(() => ({
      subscribe: jest.fn((resolve) => {
        resolve('translated');
      }),
    }));

    fixture = await render('<div t [key]="key" [params]="params" ></div>', {
      declarations: [TComponent],
      componentProperties: {
        key: 'hello',
        params: { key: 'value' },
      },
      providers: [
        {
          provide: TranslateService,
          useValue: translateSer,
        },
      ],
    });
    await waitFor(() => {
      element = screen.getByText('translated');
    });
  });

  it('adds data attribute', async () => {
    expect(element.getAttribute('data-tolgee-key-only')).toEqual('hello');
  });

  it('subscribes for translation change', async () => {
    expect(translationChangeSubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('subscribes for lang change', async () => {
    expect(langChangeSubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from translation change', async () => {
    fixture.fixture.destroy();
    expect(translationChangeUnsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from lang change', async () => {
    fixture.fixture.destroy();
    expect(langChangeUnsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
