import React from 'react';
import styled from '@mui/material/styles/styled';
import clsx from 'clsx';

const StyledWrapper = styled('div')`
  display: flex;
  outline: 0;
  cursor: default;
  padding: 4px 4px;
  border-radius: 12px;
  align-items: center;
  height: 24px;
  font-size: 14px;
  background: ${({ theme }) => theme.palette.grey[200]};
  border: 1px solid transparent;
  max-width: 100%;
  box-sizing: border-box;

  & input {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &.preview {
    background: ${({ theme }) => theme.palette.background.default};
    border: 1px solid ${({ theme }) => theme.palette.text.secondary};
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  &.hover {
    &:focus-within,
    &:hover {
      border: 1px solid ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  &.clickable {
    cursor: pointer;
  }
`;

type Props = {
  role?: 'input' | 'add';
  onClick?: () => void;
  className?: string;
};

export const Wrapper = ({
  children,
  role,
  onClick,
  className,
}: React.PropsWithChildren<Props>) => {
  switch (role) {
    case 'add':
      return (
        <StyledWrapper
          as="button"
          data-cy="translations-tag-add"
          className={clsx('preview', 'clickable', 'hover', className)}
          onClick={onClick}
        >
          {children}
        </StyledWrapper>
      );
    case 'input':
      return (
        <StyledWrapper
          data-cy="translations-tag-input"
          className={clsx('preview', 'hover', className)}
          onClick={onClick}
        >
          {children}
        </StyledWrapper>
      );
    default:
      return (
        <StyledWrapper
          data-cy="translations-tag"
          className={clsx({
            hover: Boolean(onClick),
            clickable: Boolean(onClick),
            [className || '']: true,
          })}
          onClick={onClick}
        >
          {children}
        </StyledWrapper>
      );
  }
};
