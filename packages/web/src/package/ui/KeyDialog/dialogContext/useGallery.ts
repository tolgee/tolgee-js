import { KeyPosition, UiProps } from '@tolgee/core';
import { useEffect, useState } from 'react';

import {
  changeInTolgeeCache,
  getImgSize,
  scalePositionsToImg,
  Size,
} from './tools';
import { detectExtension, takeScreenshot } from '../../../tools/extension';
import { useApiMutation } from '../../client/useQueryApi';
import { sleep } from '../../tools/sleep';

export type KeyInScreenshot = {
  keyId: number;
  keyName: string;
  keyNamespace?: string | undefined;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export interface ScreenshotInterface {
  id: number;
  filename: string;
  fileUrl: string;
  width?: number | undefined;
  height?: number | undefined;
  createdAt?: string;
  // is it screenshot or only uploaded image
  justUploaded: boolean;
  keyReferences?: KeyInScreenshot[];
}

export const useGallery = (uiProps: UiProps) => {
  const [pluginAvailable, setPluginAvailable] = useState<boolean | undefined>(
    undefined
  );
  const [takingScreenshot, setTakingScreenshot] = useState(false);
  const [screenshots, setScreenshots] = useState<ScreenshotInterface[]>([]);
  const [screenshotDetail, setScreenshotDetail] =
    useState<ScreenshotInterface | null>(null);

  useEffect(() => {
    detectExtension().then((available) => setPluginAvailable(available));
  }, []);

  const deleteImage = useApiMutation({
    url: '/v2/image-upload/{ids}',
    method: 'delete',
  });

  const uploadImage = useApiMutation({
    url: '/v2/image-upload',
    method: 'post',
  });

  const uploadScreenshot = (blob: Blob, size: Size, positions: KeyPosition[]) =>
    uploadImage.mutateAsync(
      {
        content: { 'multipart/form-data': { image: blob as any } },
      },
      {
        onSuccess(data) {
          setScreenshots((screenshots) => [
            ...screenshots,
            {
              ...data,
              ...size,
              keyReferences: positions.map((ref) => ({ ...ref, keyId: -1 })),
              justUploaded: true,
            },
          ]);
        },
      }
    );

  async function handleUploadImages(files: File[]) {
    await Promise.all(
      files.map(async (content) => {
        const url = URL.createObjectURL(content);
        const size = await getImgSize(url);
        await uploadScreenshot(content, size, []);
      })
    );
  }

  async function handleTakeScreenshot(
    key: string,
    ns: string,
    changes: [language: string, value: string][]
  ) {
    setTakingScreenshot(true);
    const { revert } = changeInTolgeeCache(
      key,
      ns,
      changes,
      uiProps.changeTranslation
    );
    await sleep(400);
    let screenshot: string;
    try {
      screenshot = await takeScreenshot();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return;
    } finally {
      revert();
      setTakingScreenshot(false);
    }

    const positions = uiProps.findPositions(key, ns);
    const screenSize = { width: window.innerWidth, height: window.innerHeight };
    const imgSize = await getImgSize(screenshot);
    const blob = await fetch(screenshot).then((r) => r.blob());

    // on hdpi screens, the screenshot can be different than the window size,
    // so we need to scale the coordinates accordingly
    const scaledPositions = scalePositionsToImg(screenSize, imgSize, positions);

    uploadScreenshot(blob, imgSize, scaledPositions);
  }

  function handleRemoveScreenshot(id: number) {
    const screenshot = screenshots.find((sc) => sc.id === id);
    if (screenshot?.justUploaded) {
      deleteImage.mutate({ path: { ids: [screenshot.id] } });
    }
    setScreenshots(screenshots.filter((sc) => sc.id !== id));
  }

  function deleteImages(ids: number[]) {
    deleteImage.mutate({ path: { ids } });
  }

  return {
    error: deleteImage.error || uploadImage.error,
    screenshotsUploading: uploadImage.isLoading,
    takingScreenshot,
    screenshots,
    setScreenshots,
    screenshotDetail,
    setScreenshotDetail,
    handleUploadImages,
    handleTakeScreenshot,
    handleRemoveScreenshot,
    deleteImages,
    canTakeScreenshots: pluginAvailable,
  };
};
