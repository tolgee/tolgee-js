jest.dontMock('./translate.pipe');
import {
  getMock,
  getObservableUnsubscribeMock,
  translateSer,
} from '../__mocks/translate.service.mock';
import { TranslatePipe } from './translate.pipe';
import {
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/angular';
import { TranslateService } from './translate.service';

describe('Translate pipe', function () {
  let fixture: RenderResult<any>;
  let element;

  const getFixture = async (template: string) => {
    const fixture = await render(template, {
      declarations: [TranslatePipe],
      componentProperties: {
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
      fixture = await getFixture("<div>{{ 'test' | translate:params }}</div>");
    });

    test('translates', () => {
      screen.getByText('translated');
    });

    it('subscribes to observable', async () => {
      expect(translateSer.get).toHaveBeenCalledTimes(1);
    });

    it('unsubscribes from observable', async () => {
      fixture.fixture.destroy();
      expect(getObservableUnsubscribeMock).toHaveBeenCalledTimes(1);
    });

    it('calls the get function with proper params', async () => {
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith('test', { key: 'value' }, undefined);
    });
  });

  describe('with default', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      fixture = await getFixture(
        "<div>{{ 'test' | translate:'What a beautiful default':params }}</div>"
      );
    });

    it('calls the get function with proper params', async () => {
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(
        'test',
        { key: 'value' },
        'What a beautiful default'
      );
    });
  });
});
