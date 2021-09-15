jest.dontMock('./TolgeeProvider');
let runResolve;
let initialLoading;
const stopMock = jest.fn();
const runMock = jest.fn(
  () =>
    new Promise((resolve) => {
      runResolve = resolve;
    })
);
jest.mock('@tolgee/core', () => ({
  Tolgee: jest.fn().mockImplementation(() => ({
    run: runMock,
    stop: stopMock,
    initialLoading: initialLoading,
  })),
}));
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { ComponentProps, useContext } from 'react';
import { TolgeeProvider, TolgeeProviderContext } from './TolgeeProvider';

import { act, render, screen, waitFor } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

describe('Tolgee Provider Component', function () {
  const componentUsingContextRendered = jest.fn();

  const ComponentUsingContext = () => {
    const context = useContext(TolgeeProviderContext);
    componentUsingContextRendered(context);
    return <></>;
  };

  const TestComponent = (props: ComponentProps<typeof TolgeeProvider>) => {
    return (
      <TolgeeProvider {...props}>
        <div>It's rendered!</div>
        <ComponentUsingContext />
      </TolgeeProvider>
    );
  };

  beforeEach(async () => {
    initialLoading = true;
    jest.clearAllMocks();
  });

  test('provides context', async () => {
    await render(<TestComponent />);
    act(() => {
      runResolve();
    });
    await waitFor(() => {
      screen.getByText("It's rendered!");
    });
    expect(componentUsingContextRendered).toHaveBeenCalledTimes(1);
    expect(
      mocked(componentUsingContextRendered).mock.calls[0][0].tolgee.run
    ).toBeDefined();
  });

  test('runs tolgee', async () => {
    act(() => {
      render(<TestComponent loadingFallback={<>loading</>} />);
    });
    await waitFor(() => {
      screen.getByText('loading');
    });
    expect(runMock).toHaveBeenCalledTimes(1);
    act(() => {
      runResolve();
    });
  });

  test('stops tolgee', () => {
    const { unmount } = render(<TestComponent />);
    unmount();
    expect(stopMock).toHaveBeenCalledTimes(1);
  });

  test('renders loadingFallback', async () => {
    act(() => {
      render(<TestComponent loadingFallback={<>loading</>} />);
    });
    await waitFor(() => {
      screen.getByText('loading');
    });
  });

  test("doesn't render loadingFallback when initialLoading is false", async () => {
    initialLoading = false;
    act(() => {
      render(<TestComponent loadingFallback={<>loading</>} />);
    });
    await waitFor(async () => {
      screen.getByText("It's rendered!");
      const loading = screen.queryByText('loading');
      expect(loading).toBeNull();
    });
  });
});
