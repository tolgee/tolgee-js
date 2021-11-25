jest.dontMock('./stranslate.pipe');
jest.dontMock('./translate.pipe');

import {
  getSafeMock,
  getSafeObservableUnsubscribeMock,
  translateSer,
} from '../__mocks/translate.service.mock';

import { STranslatePipe } from './stranslate.pipe';
import {
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/angular';
import { TranslateService } from './translate.service';

describe('Safe Translate pipe', function () {
  let fixture: RenderResult<any>;
  let element;

  beforeEach(async () => {
    jest.clearAllMocks();

    fixture = await render("<div>{{ 'test' | stranslate:params }}</div>", {
      declarations: [STranslatePipe],
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
  });

  test('translates', () => {
    screen.getByText('translated');
  });

  it('subscribes to observable', async () => {
    expect(translateSer.getSafe).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from observable', async () => {
    fixture.fixture.destroy();
    expect(getSafeObservableUnsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('calls the getSafe function with proper params', async () => {
    expect(getSafeMock).toHaveBeenCalledTimes(1);
    expect(getSafeMock).toHaveBeenCalledWith(
      'test',
      { key: 'value' },
      undefined
    );
  });
});
