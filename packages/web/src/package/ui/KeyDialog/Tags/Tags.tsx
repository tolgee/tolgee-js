import { styled } from '@mui/material';

import { Tag } from './Tag';
import { TagInput } from './TagInput';
import { useDialogActions, useDialogContext } from '../dialogContext';

const StyledTags = styled('div')`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  position: relative;

  & > * {
    margin: 0px 3px 3px 0px;
  }
`;

export function Tags() {
  const tags = useDialogContext((c) => c.tags);
  const canEditTags = useDialogContext((c) => c.permissions.canEditTags);
  const { setTags } = useDialogActions();

  return (
    <StyledTags>
      {tags.map((tag) => {
        return (
          <Tag
            key={tag}
            name={tag}
            onDelete={
              canEditTags
                ? () => setTags((tags) => tags.filter((t) => t !== tag))
                : undefined
            }
          />
        );
      })}
      {canEditTags && (
        <TagInput
          existing={tags}
          onAdd={(name) =>
            !tags.includes(name) && setTags((tags) => [...tags, name])
          }
          placeholder="Add tag..."
        />
      )}
      {!tags.length && !canEditTags && 'No tags'}
    </StyledTags>
  );
}
