import { ApiHttpService } from './ApiHttpService';
import { CoreService } from './CoreService';

export class ScreenshotService {
  constructor(
    private coreService: CoreService,
    private apiHttpService: ApiHttpService
  ) {}

  async uploadScreenshot(key: number, data: string) {
    this.coreService.checkScope('screenshots.upload');

    const formData = new FormData();

    const blob = await fetch(data).then((r) => r.blob());
    formData.append('screenshot', blob);

    return this.apiHttpService.post(
      `v2/projects/keys/${key}/screenshots`,
      undefined,
      { headers: {}, body: formData }
    );
  }
}
