import getTolgeeContext from './getTolgeeContext';
import type {
  TranslationParameters,
  GetTranslateType,
  GetTranslateResultFnProps,
} from './types';
import { derived, writable } from 'svelte/store';
import { onDestroy } from 'svelte';

const getTranslate: GetTranslateType = () => {
  const context = getTolgeeContext();
  const tolgee = context.tolgee;

  // set of used keys
  // to get updated just when specific key translation changes
  const keys = new Set();

  // dummy store which is updated to forces providing of new translate method
  const updateStore = writable(0);

  const update = () => updateStore.update((number) => number + 1);

  const translate = (
    key: string,
    parameters?: TranslationParameters,
    noWrap?: boolean,
    defaultValue?: string
  ) => {
    if (!keys.has(key)) {
      keys.add(key);
    }

    // get result from sync method instant, which is not reliable, since
    // languages may not be loaded yet
    const instantTranslated = tolgee.instant({
      key: key,
      params: parameters,
      noWrap: noWrap,
      orEmpty: true,
      defaultValue: defaultValue,
    });

    // so we have to use also translate method, to get reliable result
    tolgee
      .translate({ key: key, params: parameters, noWrap, defaultValue })
      .then((translated) => {
        // when the result value is different, we have to update the store and
        // so return new translate function
        if (instantTranslated !== translated) {
          update();
        }
      });

    return instantTranslated;
  };

  // subscribe for translation change
  const onTranslationChangeSubscription = tolgee.onTranslationChange.subscribe(
    async (changeData) => {
      // update only when this getTranslate translated the changed key value
      if (keys.has(changeData.key)) {
        update();
      }
    }
  );

  // subscribe for language change
  const onLangChangeSubscription = tolgee.onLangChange.subscribe(async () => {
    // wait for translations to be loaded, so we are waiting for translation of any key
    await tolgee.translate('key');
    update();
  });

  if (typeof window !== 'undefined') {
    //unsubscribe on destroy
    onDestroy(() => {
      onTranslationChangeSubscription.unsubscribe();
      onLangChangeSubscription.unsubscribe();
    });
  }

  // return new translate method when something is changed
  return derived(
    // when updateStore changes, translate function gets changed as well
    updateStore,
    () =>
      (
        propsOrKey: GetTranslateResultFnProps | string,
        parameters?: TranslationParameters,
        noWrap?: boolean,
        defaultValue?: string
      ) => {
        if (typeof propsOrKey === 'string') {
          return translate(propsOrKey, parameters, noWrap, defaultValue);
        }

        return translate(
          propsOrKey.key,
          propsOrKey.parameters,
          propsOrKey.noWrap,
          propsOrKey.defaultValue
        );
      }
  );
};

export default getTranslate;
