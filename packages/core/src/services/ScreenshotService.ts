import { UploadedImageModel } from '..';
import { ApiHttpService } from './ApiHttpService';
import { CoreService } from './CoreService';

export class ScreenshotService {
  constructor(
    private coreService: CoreService,
    private apiHttpService: ApiHttpService
  ) {}

  async uploadImage(blob: Blob) {
    const formData = new FormData();

    formData.append('image', blob);

    return this.apiHttpService.postJson('v2/image-upload', undefined, {
      headers: {},
      body: formData,
    }) as Promise<UploadedImageModel>;
  }

  async deleteImages(ids: number[]) {
    return this.apiHttpService.post(
      `v2/image-upload/${ids.join(',')}`,
      undefined,
      {
        method: 'delete',
      }
    ) as Promise<Response>;
  }
}
