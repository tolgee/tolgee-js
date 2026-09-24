import { useState } from 'react';
import { Link, styled } from '@mui/material';

import { components } from '../../client/apiSchema.generated';
import { useApiMutation, useApiQuery } from '../../client/useQueryApi';
import { useDialogActions, useDialogContext } from '../dialogContext';
import { changeInTolgeeCache } from '../dialogContext/tools';
import { ErrorAlert } from '../ErrorAlert';
import { SuggestionItem } from './SuggestionItem';
import { getSuggestionActions } from './getSuggestionActions';

type LanguageModel = components['schemas']['LanguageModel'];

const INITIAL_SIZE = 3;
const SHOW_MORE_STEP = 10;

const SUGGESTIONS_URL =
  '/v2/projects/languages/{languageId}/key/{keyId}/suggestion';

const StyledContainer = styled('div')`
  display: grid;
  margin-top: 8px;
  padding-bottom: 6px;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.action.hover};
`;

const StyledHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

type Props = {
  language: LanguageModel | undefined;
};

export const Suggestions = ({ language }: Props) => {
  const { refreshTranslation } = useDialogActions();
  const uiProps = useDialogContext((c) => c.uiProps);
  const keyName = useDialogContext((c) => c.input);
  const selectedNs = useDialogContext((c) => c.selectedNs);
  const keyData = useDialogContext((c) => c.keyData);
  const permissions = useDialogContext((c) => c.permissions);
  const readOnly = useDialogContext((c) => c.readOnly);
  const busy = useDialogContext((c) => c.busy);
  const icuPlaceholders = useDialogContext((c) => c.icuPlaceholders);
  const [size, setSize] = useState(INITIAL_SIZE);

  const tag = language?.tag;
  const languageId = language?.id;
  const keyId = keyData?.keyId;
  const translation = tag ? keyData?.translations[tag] : undefined;
  // activeSuggestionCount hangs off the translation record, so a language the key was never translated
  // into reports 0 while its suggestions are right there in the same payload.
  const expectedCount = Math.max(
    translation?.activeSuggestionCount ?? 0,
    translation?.suggestions?.filter((s) => s.state === 'ACTIVE').length ?? 0
  );

  const enabled =
    permissions.suggestionsEnabled &&
    expectedCount > 0 &&
    languageId !== undefined &&
    keyId !== undefined;

  const suggestionsLoadable = useApiQuery({
    url: SUGGESTIONS_URL,
    method: 'get',
    path: { languageId: languageId!, keyId: keyId! },
    query: {
      filterState: ['ACTIVE'],
      sort: ['createdAt,desc', 'id,desc'],
      size,
    },
    options: { enabled, keepPreviousData: true },
  });

  const accept = useApiMutation({
    url: '/v2/projects/languages/{languageId}/key/{keyId}/suggestion/{suggestionId}/accept',
    method: 'put',
    invalidatePrefix: SUGGESTIONS_URL,
    options: {
      onSuccess(data) {
        changeInTolgeeCache(
          keyName,
          selectedNs,
          [[tag!, data.accepted.translation ?? '']],
          uiProps.changeTranslation
        );
        uiProps.onPermanentChange({ key: keyName, namespace: selectedNs });
        refreshTranslation(tag);
      },
    },
  });
  const decline = useApiMutation({
    url: '/v2/projects/languages/{languageId}/key/{keyId}/suggestion/{suggestionId}/decline',
    method: 'put',
    invalidatePrefix: SUGGESTIONS_URL,
    options: {
      onSuccess() {
        refreshTranslation();
      },
    },
  });
  const remove = useApiMutation({
    url: '/v2/projects/languages/{languageId}/key/{keyId}/suggestion/{suggestionId}',
    method: 'delete',
    invalidatePrefix: SUGGESTIONS_URL,
    options: {
      onSuccess() {
        refreshTranslation();
      },
    },
  });

  if (!enabled || !tag) {
    return null;
  }

  const suggestions = suggestionsLoadable.data?._embedded?.suggestions ?? [];
  const total = suggestionsLoadable.data?.page?.totalElements ?? expectedCount;

  if (suggestionsLoadable.data && !suggestions.length) {
    return null;
  }

  const suggestionPath = (suggestionId: number) => ({
    languageId: languageId!,
    keyId: keyId!,
    suggestionId,
  });

  const clearErrors = () => {
    accept.reset();
    decline.reset();
    remove.reset();
  };

  const handleAccept = (suggestionId: number, declineOther: boolean) => {
    clearErrors();
    accept.mutate({
      path: suggestionPath(suggestionId),
      query: { declineOther },
    });
  };

  const handleDecline = (suggestionId: number) => {
    clearErrors();
    decline.mutate({ path: suggestionPath(suggestionId) });
  };

  const handleDelete = (suggestionId: number) => {
    clearErrors();
    remove.mutate({ path: suggestionPath(suggestionId) });
  };

  const error =
    suggestionsLoadable.error || accept.error || decline.error || remove.error;

  const disabled =
    readOnly ||
    busy ||
    accept.isLoading ||
    decline.isLoading ||
    remove.isLoading ||
    suggestionsLoadable.isFetching;

  const languageActions = {
    canReview: permissions.canReviewSuggestions(tag),
    canEdit: Boolean(permissions.canEditTranslation(tag)),
    canModerate: permissions.canModerateSuggestions(tag),
    canDeleteOwn: permissions.canDeleteOwnSuggestion,
    activeCount: total,
  };

  return (
    <StyledContainer data-cy="suggestions-list" data-cy-language={tag}>
      <StyledHeader>
        <div>Suggestions ({total})</div>
        {total > suggestions.length && (
          <Link
            component="button"
            type="button"
            underline="hover"
            data-cy="suggestions-show-more"
            onClick={() => setSize(size + SHOW_MORE_STEP)}
          >
            Show more
          </Link>
        )}
      </StyledHeader>
      {suggestions.map((suggestion) => (
        <SuggestionItem
          key={suggestion.id}
          suggestion={suggestion}
          apiUrl={uiProps.apiUrl}
          locale={tag}
          keyIsPlural={Boolean(keyData?.keyIsPlural)}
          icuPlaceholders={icuPlaceholders}
          disabled={disabled}
          actions={getSuggestionActions({
            ...languageActions,
            isOwn: permissions.currentUserId === suggestion.author.id,
          })}
          onAccept={() => handleAccept(suggestion.id, false)}
          onAcceptAndDeclineOthers={() => handleAccept(suggestion.id, true)}
          onDecline={() => handleDecline(suggestion.id)}
          onDelete={() => handleDelete(suggestion.id)}
        />
      ))}
      {error && <ErrorAlert error={error} />}
    </StyledContainer>
  );
};
