import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';

const StyledButton = styled(Button)`
  position: 'relative';
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = ButtonProps & {
  loading?: boolean;
};

export const LoadingButton: React.FC<Props> = ({
  children,
  loading,
  disabled,
  ...props
}) => {
  const isDisabled = loading || disabled;

  return (
    <StyledButton {...props} disabled={isDisabled}>
      {loading && (
        <LoadingWrapper>
          <CircularProgress size={25} />
        </LoadingWrapper>
      )}
      {children}
    </StyledButton>
  );
};
