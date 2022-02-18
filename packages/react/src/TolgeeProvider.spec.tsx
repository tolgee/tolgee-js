jest.dontMock('./TolgeeProvider');
jest.dontMock('./mocks/mockTolgee');

import { mockTolgee } from './mocks/mockTolgee';
import * as tolgee from '@tolgee/core';

import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { ComponentProps, useContext } from 'react';
import { TolgeeProvider, TolgeeProviderContext } from './TolgeeProvider';

import { act, render, screen, waitFor } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

describe('Tolgee Provider Component', function () {
  const componentUsingContextRendered = jest.fn();
  let mockedTolgee: ReturnType<typeof mockTolgee>;

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
    mockedTolgee = mockTolgee();
    // @ts-ignore
    tolgee.Tolgee = mockedTolgee.tolgeeClass;
    jest.clearAllMocks();
  });

  test('provides context', async () => {
    await render(<TestComponent />);
    act(() => {
      mockedTolgee.runMock.resolveRunPromise();
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
    expect(mockedTolgee.runMock.run).toHaveBeenCalledTimes(1);
    await act(async () => {
      await mockedTolgee.runMock.resolveRunPromise();
    });
  });

  test('stops tolgee', () => {
    const { unmount } = render(<TestComponent />);
    unmount();
    expect(mockedTolgee.stopMock).toHaveBeenCalledTimes(1);
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
    // @ts-ignore
    mockedTolgee.tolgee.initialLoading = false;
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
