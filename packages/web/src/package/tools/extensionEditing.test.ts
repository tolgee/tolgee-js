import { isEditingSwitchedOffByExtension } from './extensionEditing';
import {
  EDITING_SESSION_STORAGE,
  TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX,
} from './sessionStorageKeys';

describe('isEditingSwitchedOffByExtension', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('is true only while the slot the extension writes says off', () => {
    expect(isEditingSwitchedOffByExtension()).toBe(false);
    sessionStorage.setItem(EDITING_SESSION_STORAGE, 'off');
    expect(isEditingSwitchedOffByExtension()).toBe(true);
    sessionStorage.setItem(EDITING_SESSION_STORAGE, 'on');
    expect(isEditingSwitchedOffByExtension()).toBe(false);
  });

  it('reads the slot the extension names, under the prefix clearSessionStorage sweeps', () => {
    expect(EDITING_SESSION_STORAGE).toBe('__tolgee_editing');
    expect(
      EDITING_SESSION_STORAGE.startsWith(
        TOLGEE_EXTENSION_SESSION_STORAGE_PREFIX
      )
    ).toBe(true);
  });

  it('is false where sessionStorage cannot be read', () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      window,
      'sessionStorage'
    );
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError');
      },
    });
    try {
      expect(isEditingSwitchedOffByExtension()).toBe(false);
    } finally {
      Object.defineProperty(window, 'sessionStorage', descriptor!);
    }
  });
});
