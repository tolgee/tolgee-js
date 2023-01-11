// needs to be same as in @tolgee/core package
export const DEVTOOLS_ID = '__tolgee_dev_tools';

export const DEVTOOLS_Z_INDEX = 2147483000;

export const CHROME_EXTENSION_LINK =
  'https://chrome.google.com/webstore/detail/tolgee-tools/hacnbapajkkfohnonhbmegojnddagfnj';

export const PREFERRED_LANGUAGES_LOCAL_STORAGE_KEY =
  '__tolgee_preferredLanguages';

export const MAX_LANGUAGES_SELECTED = 5;

/**
 * Use this if you want to indicate to tolgee that element contains key
 */
export const TOLGEE_WRAPPED_ONLY_DATA_ATTRIBUTE = 'data-tolgee-key-only';
/**
 * Use this attribute if you want tolgee Observer to not touch part of the DOM
 */
export const TOLGEE_RESTRICT_ATTRIBUTE = 'data-tolgee-restricted';
/**
 * This attribute is present on elements that have been registred by tolgee and are clickable for in-context
 */
export const TOLGEE_ATTRIBUTE_NAME = '_tolgee';
export const TOLGEE_HIGHLIGHTER_CLASS = '_tolgee-highlighter';
