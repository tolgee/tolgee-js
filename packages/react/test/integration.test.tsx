jest.autoMockOff();

import { TolgeeProvider, T } from '../src';
import * as React from 'react';
import { render, waitFor, screen } from '@testing-library/react';

describe('integration', () => {
  describe('basic', () => {
    beforeEach(() => {
      global.fetch = jest.fn(async () => {
        return {
          json: jest.fn(async () => ({
            sampleApp: {
              english_text_one: 'English text one.',
            },
          })),
        };
      }) as any;

      render(
        <TolgeeProvider>
          <div>
            <T>sampleApp.english_text_one</T>
          </div>
          <div>
            <T>sampleApp.not_found</T>
          </div>
        </TolgeeProvider>
      );
    });

    test('Will translate string', async () => {
      await waitFor(() => screen.getByText('English text one.'));
    });

    test('Will not translate string, what is not found', async () => {
      await waitFor(() => screen.getByText('not_found'));
    });
  });
});
