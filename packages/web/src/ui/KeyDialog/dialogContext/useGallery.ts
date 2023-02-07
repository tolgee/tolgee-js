import { UiProps } from '@tolgee/core';
import { useEffect, useState } from 'react';
import { detectExtension, takeScreenshot } from '../../../tools/extension';
import { useApiMutation } from '../../client/useQueryApi';
import { sleep } from '../../tools/sleep';
import { changeInTolgeeCache } from './tools';

export interface ScreenshotInterface {
  id: number;
  filename: string;
  fileUrl: string;
  createdAt?: string;
  // is it screenshot or only uploaded image
  justUploaded: boolean;
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
    options: {
      onSuccess(data) {
        setScreenshots((screenshots) => [
          ...screenshots,
          { ...data, justUploaded: true },
        ]);
      },
    },
  });

  const uploadScreenshot = (blob: Blob) =>
    uploadImage.mutate({
      content: { 'multipart/form-data': { image: blob as any } },
    });

  async function handleUploadImages(files: File[]) {
    await Promise.all(files.map((content) => uploadScreenshot(content)));
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
    await sleep(100);
    const { unhighlight } = uiProps.highlight(key, ns);
    await sleep(100);
    let screenshot: string;
    try {
      screenshot = await takeScreenshot();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return;
    } finally {
      revert();
      unhighlight();
      setTakingScreenshot(false);
    }

    const blob = await fetch(screenshot).then((r) => r.blob());

    uploadScreenshot(blob);
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
