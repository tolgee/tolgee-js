import { OpenInNew } from '@mui/icons-material';
import { styled } from '@mui/material';

type Props = {
  href: string;
  children: React.ReactNode;
};

const StyledLink = styled('a')``;

const StyledIcon = styled(OpenInNew)`
  width: 17px;
  height: 17px;
  position: relative;
  top: 3px;
  margin-left: 1px;
`;

export const NewTabLink = ({ href, children }: Props) => {
  return (
    <StyledLink href={href} target="_blank" rel="noreferrer noopener">
      {children}
      <StyledIcon />
    </StyledLink>
  );
};
