import { Tolgee, GlobalInstancePlugin, getGlobalInstance } from '../index';

describe('global instance plugin', () => {
  it('will register tolgee globally', async () => {
    const tolgee = Tolgee().use(GlobalInstancePlugin());

    expect(getGlobalInstance() === tolgee).toBeTruthy();
  });
});
