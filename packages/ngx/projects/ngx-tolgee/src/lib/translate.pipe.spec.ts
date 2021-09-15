jest.dontMock('./translate.pipe');
import {
  getMock,
  getSafeMock,
  langChangeSubscribeMock,
  langChangeUnsubscribeMock,
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

  beforeEach(async () => {
    jest.clearAllMocks();

    fixture = await render("<div>{{ 'test' | translate:params }}</div>", {
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
  });

  test('translates', () => {
    screen.getByText('translated');
  });

  it('subscribes for lang change', async () => {
    expect(langChangeSubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from lang change', async () => {
    fixture.fixture.destroy();
    expect(langChangeUnsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it('calls the get function with proper params', async () => {
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('test', { key: 'value' });
  });
});
