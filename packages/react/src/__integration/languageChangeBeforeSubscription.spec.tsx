import React, { Profiler, useLayoutEffect } from 'react';
import '@testing-library/jest-dom';
import {
  Tolgee,
  TolgeeInstance,
  TolgeeProvider,
  useTolgee,
  useTranslate,
} from '..';
import { render, screen, waitFor } from '@testing-library/react';

describe('language change before the update subscription', () => {
  let tolgee: TolgeeInstance;

  const Greeting = () => {
    const { t } = useTranslate();
    return <p data-testid="greeting">{t('greeting')}</p>;
  };

  const SwitchToFrenchBeforeSubscriptions = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    useLayoutEffect(() => {
      tolgee.changeLanguage('fr');
    }, []);
    return <>{children}</>;
  };

  beforeEach(async () => {
    tolgee = Tolgee().init({
      language: 'en',
      staticData: {
        en: { greeting: 'Hello' },
        fr: { greeting: 'Bonjour' },
      },
      autoLoadRequiredData: false,
    });
    await tolgee.run();
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('renders the new language when it changed before the effect subscribed', async () => {
    render(
      <TolgeeProvider tolgee={tolgee} fallback="Loading...">
        <SwitchToFrenchBeforeSubscriptions>
          <Greeting />
        </SwitchToFrenchBeforeSubscriptions>
      </TolgeeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('greeting')).toHaveTextContent('Bonjour');
    });
  });

  it('does not render again when the language did not change', async () => {
    const onRender = jest.fn();
    render(
      <TolgeeProvider tolgee={tolgee} fallback="Loading...">
        <Profiler id="greeting" onRender={onRender}>
          <Greeting />
        </Profiler>
      </TolgeeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello');
    });
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  const LanguageName = () => {
    const language = useTolgee(['language']).getLanguage();
    return <p data-testid="language">{language}</p>;
  };

  it('renders the new language in a useTolgee reader that subscribed late', async () => {
    render(
      <TolgeeProvider tolgee={tolgee} fallback="Loading...">
        <SwitchToFrenchBeforeSubscriptions>
          <LanguageName />
        </SwitchToFrenchBeforeSubscriptions>
      </TolgeeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('fr');
    });
  });

  it('does not render a useTolgee reader again when the language did not change', async () => {
    const onRender = jest.fn();
    render(
      <TolgeeProvider tolgee={tolgee} fallback="Loading...">
        <Profiler id="language" onRender={onRender}>
          <LanguageName />
        </Profiler>
      </TolgeeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });
    expect(onRender).toHaveBeenCalledTimes(1);
  });
});
