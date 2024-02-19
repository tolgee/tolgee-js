import React from 'react';
import { styled } from '@mui/material/styles';

const StyledEditorWrapper = styled('div')`
  border: 1px solid
    ${({ theme }) => (theme.palette.mode === 'dark' ? '#535e6c' : '#bfbfbf')};
  overflow: hidden;
  border-radius: 4px;
  cursor: text;
  background: ${({ theme }) => theme.palette.background.default};
  padding: 1px;

  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.grey[900]};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.palette.grey[900]};
    border-width: 2px;
    padding: 0px;
  }

  & > * {
    padding: 8px 10px;
  }
`;

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const EditorWrapper = ({ children, ...props }: Props) => {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const editor = (e.target as HTMLDivElement).querySelector('.cm-content') as
      | HTMLDivElement
      | undefined;
    editor?.focus();
  };

  return (
    <StyledEditorWrapper
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </StyledEditorWrapper>
  );
};
