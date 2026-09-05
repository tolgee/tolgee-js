import { KeyPosition, UiProps } from '@tolgee/core';
import { useEffect, useState } from 'react';

import { changeInTolgeeCache, getImgSize, Size } from './tools';
import { useExtensionScreenshotUpload } from './useExtensionScreenshotUpload';
import { legacyScreenshotUpload } from './legacyScreenshotUpload';
import { detectExtension } from '../../../tools/extension';
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
    let mounted = true;
    detectExtension().then(
      (available) => mounted && setPluginAvailable(available)
    );
    return () => {
      mounted = false;
    };
  }, []);

  const deleteImage = useApiMutation({
    url: '/v2/image-upload/{ids}',
    method: 'delete',
  });

  const uploadImage = useApiMutation({
    url: '/v2/image-upload',
    method: 'post',
  });

  const addScreenshot = (
    data: Omit<ScreenshotInterface, 'justUploaded'>,
    size: Size,
    positions: KeyPosition[]
  ) =>
    setScreenshots((screenshots) => [
      ...screenshots,
      {
        ...data,
        ...size,
        keyReferences: positions.map((ref) => ({ ...ref, keyId: -1 })),
        justUploaded: true,
      },
    ]);

  const extensionScreenshot = useExtensionScreenshotUpload(
    uiProps.findPositions,
    addScreenshot
  );

  const uploadScreenshot = (blob: Blob, size: Size, positions: KeyPosition[]) =>
    uploadImage.mutateAsync(
      {
        content: { 'multipart/form-data': { image: blob as any } },
      },
      {
        onSuccess(data) {
          addScreenshot(data, size, positions);
        },
      }
    );

  const legacyScreenshot = legacyScreenshotUpload(
    uiProps.findPositions,
    uploadScreenshot
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
    const screenSize = { width: window.innerWidth, height: window.innerHeight };

    const args = {
      key,
      ns,
      revert,
      onTakingScreenshotChange: setTakingScreenshot,
      screenSize,
    };

    if (uiProps.transport) {
      await extensionScreenshot.take(args).catch(() => undefined);
      return;
    }

    await legacyScreenshot.take(args);
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
    error: deleteImage.error || uploadImage.error || extensionScreenshot.error,
    screenshotsUploading: uploadImage.isLoading || extensionScreenshot.loading,
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
