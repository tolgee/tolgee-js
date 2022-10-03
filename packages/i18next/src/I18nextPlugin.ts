import {
  TolgeePlugin,
  ObserverOptions,
  DevTools,
  BrowserExtensionPlugin,
} from '@tolgee/web';

type Props = Partial<ObserverOptions>;

export const I18nextPlugin =
  (props?: Props): TolgeePlugin =>
  (tolgee) =>
    tolgee
      .use(BrowserExtensionPlugin())
      .use(DevTools({ observer: props }))
      .init({ ns: [] });
