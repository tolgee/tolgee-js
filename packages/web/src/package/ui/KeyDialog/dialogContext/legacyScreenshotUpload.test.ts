jest.mock('../../../tools/extension', () => ({
  takeScreenshot: jest.fn(),
}));
jest.mock('./tools', () => ({
  getImgSize: jest.fn(),
  scalePositionsToImg: jest.fn(),
}));

import { legacyScreenshotUpload } from './legacyScreenshotUpload';
import { takeScreenshot } from '../../../tools/extension';
import { getImgSize, scalePositionsToImg } from './tools';

const mockTakeScreenshot = takeScreenshot as jest.Mock;
const mockGetImgSize = getImgSize as jest.Mock;
const mockScalePositions = scalePositionsToImg as jest.Mock;

const screenSize = { width: 100, height: 100 };
const positions = [
  {
    keyId: 1,
    keyName: 'k',
    keyNamespace: undefined,
    position: { x: 0, y: 0, width: 1, height: 1 },
  },
];

describe('legacyScreenshotUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({ blob: () => Promise.resolve(new Blob(['x'])) })
    ) as any;
  });

  it('captures via the page (not the extension), reverts and stops the spinner, then uploads the scaled positions', async () => {
    mockTakeScreenshot.mockResolvedValue('data:image/png;base64,abc');
    mockGetImgSize.mockResolvedValue({ width: 200, height: 200 });
    mockScalePositions.mockReturnValue(['scaled']);
    const findPositions = jest.fn(() => positions);
    const uploadScreenshot = jest.fn();
    const revert = jest.fn();
    const onTakingScreenshotChange = jest.fn();

    const { take } = legacyScreenshotUpload(findPositions, uploadScreenshot);
    await take({
      key: 'k',
      ns: 'ns',
      revert,
      onTakingScreenshotChange,
      screenSize,
    });

    expect(mockTakeScreenshot).toHaveBeenCalled();
    expect(revert).toHaveBeenCalled();
    expect(onTakingScreenshotChange).toHaveBeenCalledWith(false);
    expect(findPositions).toHaveBeenCalledWith('k', 'ns');
    expect(mockScalePositions).toHaveBeenCalledWith(
      screenSize,
      { width: 200, height: 200 },
      positions
    );
    expect(uploadScreenshot).toHaveBeenCalledWith(
      expect.any(Blob),
      { width: 200, height: 200 },
      ['scaled']
    );
  });

  it('still reverts and stops the spinner when the capture itself fails, and never uploads', async () => {
    mockTakeScreenshot.mockRejectedValue(new Error('capture failed'));
    const uploadScreenshot = jest.fn();
    const revert = jest.fn();
    const onTakingScreenshotChange = jest.fn();
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const { take } = legacyScreenshotUpload(() => positions, uploadScreenshot);
    await take({
      key: 'k',
      ns: 'ns',
      revert,
      onTakingScreenshotChange,
      screenSize,
    });

    expect(revert).toHaveBeenCalled();
    expect(onTakingScreenshotChange).toHaveBeenCalledWith(false);
    expect(uploadScreenshot).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
