import { styled } from '@mui/material';
import { useDialogActions } from '../dialogContext';

const StyledTag = styled('div')`
  display: inline-flex;
  outline: 0;
  cursor: default;
  padding: 1px 8px;
  border-radius: 12px;
  align-items: center;
  font-size: 14px;
  background: ${({ theme }) => theme.palette.grey[200]};
  border: 1px solid transparent;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.palette.text.secondary};
  margin: -2px 0px;
  cursor: pointer;
  &:focus-within,
  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

type Props = {
  name: string;
};

export const MissingTag = ({ name }: Props) => {
  const { setTags } = useDialogActions();
  function addTag(name: string) {
    setTags((values) => [...values.filter((t) => t !== name), name]);
  }

  return <StyledTag onClick={() => addTag(name)}>{name}</StyledTag>;
};
