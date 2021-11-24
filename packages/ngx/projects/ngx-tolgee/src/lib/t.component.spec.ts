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
  let observableUnsubscribeMock = jest.fn();
  let observableSubscribeMock = jest.fn(() => ({
    unsubscribe: observableUnsubscribeMock,
  }));

  let getSafeMock = jest.fn(() => ({
    subscribe: jest.fn((resolve) => {
      resolve('translated');
      return observableSubscribeMock();
    }),
  }));
  const getFixture = async (html: string) => {
    translateSer = createMock(TranslateService);
    (translateSer as any).getSafe = getSafeMock;

    fixture = await render(html, {
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
    return fixture;
  };

  describe('without default', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      fixture = await getFixture('<div t [key]="key" [params]="params"></div>');
    });

    it('adds data attribute', async () => {
      expect(element.getAttribute('data-tolgee-key-only')).toEqual('hello');
    });

    it('sets inner text', async () => {
      expect(element.textContent).toEqual('translated');
    });

    it('subscribes for observable change', async () => {
      expect(observableSubscribeMock).toHaveBeenCalledTimes(1);
    });

    it('calls getSafe method', async () => {
      expect(getSafeMock).toHaveBeenCalledWith(
        'hello',
        { key: 'value' },
        undefined
      );
      expect(getSafeMock).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes on destroy', async () => {
      expect(observableUnsubscribeMock).toHaveBeenCalledTimes(0);
      fixture.fixture.destroy();
      expect(observableUnsubscribeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('with default', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });
    it('passes default value correctly', async () => {
      await getFixture('<div t [key]="key" default="Yaaaaai!"></div>');
      expect(getSafeMock).toHaveBeenCalledWith('hello', undefined, 'Yaaaaai!');
    });
  });
});
