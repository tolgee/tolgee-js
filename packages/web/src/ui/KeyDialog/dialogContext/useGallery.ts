import { KeyPosition, UiProps } from '@tolgee/core';
import { useEffect, useState } from 'react';
import { detectExtension, takeScreenshot } from '../../../tools/extension';
import { useApiMutation } from '../../client/useQueryApi';
import { sleep } from '../../tools/sleep';
import { changeInTolgeeCache, getImgSize, Size } from './tools';

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
    translationsForm: Record<string, string>
  ) {
    setTakingScreenshot(true);
    const { revert } = changeInTolgeeCache(
      key,
      ns,
      Object.entries(translationsForm),
      uiProps.changeTranslation
    );
    await sleep(400);
    let screenshot: string;
    let positions: KeyPosition[];
    try {
      screenshot = await takeScreenshot();
      positions = uiProps.findPositions(key, ns);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return;
    } finally {
      revert();
      setTakingScreenshot(false);
    }

    const blob = await fetch(screenshot).then((r) => r.blob());
    const size = await getImgSize(screenshot);

    uploadScreenshot(blob, size, positions);
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
