import { KeyPosition } from '@tolgee/core';
import { useMutation } from 'react-query';

import { scalePositionsToImg, Size } from './tools';
import { ScreenshotInterface } from './useGallery';
import { uploadScreenshotViaExtension } from '../../../tools/extensionRpc';
import {
  httpErrorFromExtension,
  toResponseLike,
} from '../../../tools/apiTransport';
import { readApiResponse } from '../../client/client';
import { HttpError } from '../../client/HttpError';

type AddScreenshot = (
  data: Omit<ScreenshotInterface, 'justUploaded'>,
  size: Size,
  positions: KeyPosition[]
) => void;

export type TakeArgs = {
  key: string;
  ns: string;
  revert: () => void;
  onTakingScreenshotChange: (taking: boolean) => void;
  screenSize: Size;
};

type UploadResult = {
  data: Omit<ScreenshotInterface, 'justUploaded'>;
  imgSize: Size;
  positions: KeyPosition[];
};

export const useExtensionScreenshotUpload = (
  findPositions: (key: string, ns: string) => KeyPosition[],
  addScreenshot: AddScreenshot
) => {
  const upload = useMutation<UploadResult, HttpError, TakeArgs>(
    async ({ key, ns, revert, onTakingScreenshotChange, screenSize }) => {
      let measured: KeyPosition[] | undefined;
      const revertAndMeasure = () => {
        if (!measured) {
          revert();
          onTakingScreenshotChange(false);
          measured = findPositions(key, ns);
        }
        return measured;
      };
      try {
        const { response, width, height } = await uploadScreenshotViaExtension(
          () => {
            revertAndMeasure();
          }
        );
        const positions = revertAndMeasure();
        const data = await readApiResponse(toResponseLike(response));
        const imgSize = { width, height };
        return {
          data,
          imgSize,
          positions: scalePositionsToImg(screenSize, imgSize, positions),
        };
      } catch (e) {
        revertAndMeasure();
        throw httpErrorFromExtension(e);
      }
    },
    {
      onSuccess: ({ data, imgSize, positions }) =>
        addScreenshot(data, imgSize, positions),
    }
  );

  return {
    take: upload.mutateAsync,
    loading: upload.isLoading,
    error: upload.error ?? null,
  };
};
