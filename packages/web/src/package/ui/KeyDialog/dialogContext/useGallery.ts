import { KeyPosition, UiProps } from '@tolgee/core';
import { useEffect, useState } from 'react';

import {
  changeInTolgeeCache,
  getImgSize,
  scalePositionsToImg,
  Size,
} from './tools';
import { detectExtension, takeScreenshot } from '../../../tools/extension';
import { uploadScreenshotViaExtension } from '../../../tools/extensionRpc';
import {
  httpErrorFromExtension,
  toResponseLike,
} from '../../../tools/apiTransport';
import { readApiResponse } from '../../client/client';
import { HttpError } from '../../client/HttpError';
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

type ExtensionUpload = { loading: boolean; error: HttpError | null };

export const useGallery = (uiProps: UiProps) => {
  const [pluginAvailable, setPluginAvailable] = useState<boolean | undefined>(
    undefined
  );
  const [takingScreenshot, setTakingScreenshot] = useState(false);
  const [screenshots, setScreenshots] = useState<ScreenshotInterface[]>([]);
  const [screenshotDetail, setScreenshotDetail] =
    useState<ScreenshotInterface | null>(null);
  const [extensionUpload, setExtensionUpload] = useState<ExtensionUpload>({
    loading: false,
    error: null,
  });

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

    if (uiProps.transport) {
      await takeScreenshotViaExtension(key, ns, revert, screenSize);
      return;
    }

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
    const imgSize = await getImgSize(screenshot);
    const blob = await fetch(screenshot).then((r) => r.blob());

    // on hdpi screens, the screenshot can be different than the window size,
    // so we need to scale the coordinates accordingly
    const scaledPositions = scalePositionsToImg(screenSize, imgSize, positions);

    uploadScreenshot(blob, imgSize, scaledPositions);
  }

  // The extension captures and uploads the image itself; the page only learns the result and the image size.
  async function takeScreenshotViaExtension(
    key: string,
    ns: string,
    revert: () => void,
    screenSize: Size
  ) {
    let positions: KeyPosition[] | undefined;
    const restore = () => {
      if (positions) {
        return;
      }
      revert();
      setTakingScreenshot(false);
      positions = uiProps.findPositions(key, ns);
    };
    setExtensionUpload({ loading: true, error: null });
    try {
      const { response, width, height } =
        await uploadScreenshotViaExtension(restore);
      restore();
      const data = await readApiResponse(toResponseLike(response));
      const imgSize = { width, height };
      addScreenshot(
        data,
        imgSize,
        scalePositionsToImg(screenSize, imgSize, positions!)
      );
      setExtensionUpload({ loading: false, error: null });
    } catch (e) {
      restore();
      setExtensionUpload({ loading: false, error: httpErrorFromExtension(e) });
    }
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
    error: deleteImage.error || uploadImage.error || extensionUpload.error,
    screenshotsUploading: uploadImage.isLoading || extensionUpload.loading,
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
