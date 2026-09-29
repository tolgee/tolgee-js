import { useState } from 'react';
import { ListItemIcon, Menu, MenuItem, styled } from '@mui/material';
import {
  Check,
  Close,
  DeleteOutline,
  DoneAll,
  MoreVert,
} from '@mui/icons-material';

import { DEVTOOLS_Z_INDEX } from '../../../constants';
import { components } from '../../client/apiSchema.generated';
import { TranslationPlurals } from '../editor/TranslationPlurals';
import { ControlsButton } from '../State/ControlsButton';
import { Tooltip } from '../../common/Tooltip';
import { getAvatarUrl } from './getAvatarUrl';
import { getSuggestionActions } from './getSuggestionActions';
import { getPluralForms } from './getPluralForms';
import { formatSuggestionDate } from './formatSuggestionDate';

type TranslationSuggestionModel =
  components['schemas']['TranslationSuggestionModel'];

const StyledItem = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: start;
  padding: 8px 12px;
  font-size: 14px;
`;

const StyledAvatar = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  font-size: 12px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.background.default};
  background: ${({ theme }) => theme.palette.text.secondary};

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StyledText = styled('div')`
  padding: 2px 0px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const StyledMeta = styled('div')`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const StyledActions = styled('div')`
  display: flex;
  gap: 12px;
  padding: 3px 4px 0px 4px;
`;

type Props = {
  suggestion: TranslationSuggestionModel;
  actions: ReturnType<typeof getSuggestionActions>;
  apiUrl: string | undefined;
  locale: string;
  keyIsPlural: boolean;
  icuPlaceholders: boolean | undefined;
  disabled: boolean;
  onAccept: () => void;
  onAcceptAndDeclineOthers: () => void;
  onDecline: () => void;
  onDelete: () => void;
};

export const SuggestionItem = ({
  suggestion,
  actions,
  apiUrl,
  locale,
  keyIsPlural,
  icuPlaceholders,
  disabled,
  onAccept,
  onAcceptAndDeclineOthers,
  onDecline,
  onDelete,
}: Props) => {
  const { author } = suggestion;
  const authorName = author.name || author.username;
  const [imgFailed, setImgFailed] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const avatarUrl = getAvatarUrl(author.avatar?.thumbnail, apiUrl);
  const pluralForms = getPluralForms({
    text: suggestion.translation ?? '',
    keyIsPlural,
    icuPlaceholders,
  });

  const inlineButtons = [
    {
      visible: actions.accept,
      dataCy: 'suggestion-accept',
      label: actions.acceptAndDeclineOthers ? 'Accept only' : 'Accept',
      icon: <Check fontSize="small" />,
      onClick: onAccept,
    },
    {
      visible: actions.decline,
      dataCy: 'suggestion-decline',
      label: 'Decline',
      icon: <Close fontSize="small" />,
      onClick: onDecline,
    },
  ].filter((button) => button.visible);

  const menuButtons = [
    {
      visible: actions.acceptAndDeclineOthers,
      dataCy: 'suggestion-accept-decline-others',
      label: 'Accept and decline others',
      icon: <DoneAll fontSize="small" />,
      onClick: onAcceptAndDeclineOthers,
    },
    {
      visible: actions.delete,
      dataCy: 'suggestion-delete',
      label: 'Delete',
      icon: <DeleteOutline fontSize="small" />,
      onClick: onDelete,
    },
  ].filter((button) => button.visible);

  return (
    <StyledItem data-cy="suggestion-item">
      <Tooltip title={authorName}>
        <StyledAvatar>
          {avatarUrl && !imgFailed ? (
            <img src={avatarUrl} alt="" onError={() => setImgFailed(true)} />
          ) : (
            authorName[0]
          )}
        </StyledAvatar>
      </Tooltip>
      <div>
        <StyledText data-cy="suggestion-item-text">
          {pluralForms ? (
            <TranslationPlurals
              locale={locale}
              value={pluralForms}
              render={({ content }) => content}
            />
          ) : (
            suggestion.translation
          )}
        </StyledText>
        <StyledMeta data-cy="suggestion-item-meta">
          {authorName} · {formatSuggestionDate(suggestion.createdAt)}
        </StyledMeta>
      </div>
      <StyledActions>
        {inlineButtons.map((button) => (
          <ControlsButton
            key={button.dataCy}
            data-cy={button.dataCy}
            tooltip={button.label}
            disabled={disabled}
            onClick={button.onClick}
          >
            {button.icon}
          </ControlsButton>
        ))}
        {menuButtons.length > 0 && (
          <>
            <ControlsButton
              data-cy="suggestion-menu"
              tooltip="More"
              disabled={disabled}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MoreVert fontSize="small" />
            </ControlsButton>
            <Menu
              open={Boolean(menuAnchor)}
              anchorEl={menuAnchor}
              onClose={() => setMenuAnchor(null)}
              style={{ zIndex: DEVTOOLS_Z_INDEX }}
              disablePortal
              disableEnforceFocus
            >
              {menuButtons.map((button) => (
                <MenuItem
                  key={button.dataCy}
                  data-cy={button.dataCy}
                  dense
                  disabled={disabled}
                  onClick={() => {
                    setMenuAnchor(null);
                    button.onClick();
                  }}
                >
                  <ListItemIcon>{button.icon}</ListItemIcon>
                  {button.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </StyledActions>
    </StyledItem>
  );
};
