import { styled } from '@mui/material';

import { useDialogContext } from './dialogContext';
import { ErrorAlert } from './ErrorAlert';

const StyledNote = styled('div')`
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const NOTES = {
  willSuggest: 'Your change will be sent as a suggestion.',
  reviewedProtected:
    'Reviewed translations are protected. Your change will be sent as a suggestion.',
  cleared: "An empty suggestion can't be sent — this field is left unchanged.",
};

type Props = {
  language: string | undefined;
};

export const SuggestionFieldStatus = ({ language }: Props) => {
  const tag = language ?? '';
  const willSuggest = useDialogContext(
    (c) => c.dispositions[tag] === 'suggest'
  );
  const mayEdit = useDialogContext((c) =>
    Boolean(c.permissions.canEditTranslation(tag))
  );
  const error = useDialogContext((c) => c.suggestionErrors[tag]);
  const cleared = useDialogContext((c) => c.clearedSuggestFields.includes(tag));

  const note = cleared
    ? 'cleared'
    : mayEdit
      ? 'reviewedProtected'
      : 'willSuggest';

  return (
    <>
      {willSuggest && (
        <StyledNote
          data-cy="translation-field-suggest-note"
          data-cy-language={language}
          data-cy-kind={note}
        >
          {NOTES[note]}
        </StyledNote>
      )}
      {error && (
        <div data-cy="translation-field-error" data-cy-language={language}>
          <ErrorAlert error={error} />
        </div>
      )}
    </>
  );
};
