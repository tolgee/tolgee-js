import { styled } from '@mui/material';

type Props = {
  currentCount: number;
  maxLimit: number | null | undefined;
};

const ScContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const ScWarning = styled('span')`
  color: ${({ theme }) => theme.palette.error.main};
`;

const ScCount = styled('span')<{ over: boolean }>`
  margin-left: auto;
  color: ${({ theme, over }) =>
    over ? theme.palette.error.main : theme.palette.text.secondary};
`;

export const CharacterCounter = ({ currentCount, maxLimit }: Props) => {
  if (maxLimit == null || maxLimit <= 0) return null;

  const over = currentCount > maxLimit;
  const atLimit = currentCount === maxLimit;

  return (
    <ScContainer>
      {over && (
        <ScWarning>
          Limit exceeded by {currentCount - maxLimit} character
          {currentCount - maxLimit !== 1 ? 's' : ''}
        </ScWarning>
      )}
      {atLimit && <ScWarning>Limit reached</ScWarning>}
      <ScCount over={over || atLimit}>
        {currentCount}/{maxLimit}
      </ScCount>
    </ScContainer>
  );
};
