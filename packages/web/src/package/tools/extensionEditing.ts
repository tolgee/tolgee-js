import { EDITING_SESSION_STORAGE } from './sessionStorageKeys';

export function isEditingSwitchedOffByExtension(): boolean {
  try {
    return sessionStorage.getItem(EDITING_SESSION_STORAGE) === 'off';
  } catch {
    return false;
  }
}
