import { KeyPosition } from '@tolgee/core';

import { getImgSize, scalePositionsToImg, Size } from './tools';
import { TakeArgs } from './useExtensionScreenshotUpload';
import { takeScreenshot } from '../../../tools/extension';

type UploadScreenshot = (
  blob: Blob,
  size: Size,
  positions: KeyPosition[]
) => void;

export const legacyScreenshotUpload = (
  findPositions: (key: string, ns: string) => KeyPosition[],
  uploadScreenshot: UploadScreenshot
) => {
  const take = async ({
    key,
    ns,
    revert,
    onTakingScreenshotChange,
    screenSize,
  }: TakeArgs) => {
    let screenshot: string;
    try {
      screenshot = await takeScreenshot();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return;
    } finally {
      revert();
      onTakingScreenshotChange(false);
    }

    const positions = findPositions(key, ns);
    const imgSize = await getImgSize(screenshot);
    const blob = await fetch(screenshot).then((r) => r.blob());

    // on hdpi screens, the screenshot can be different than the window size,
    // so we need to scale the coordinates accordingly
    const scaledPositions = scalePositionsToImg(screenSize, imgSize, positions);

    uploadScreenshot(blob, imgSize, scaledPositions);
  };

  return { take };
};
