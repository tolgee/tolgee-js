import { styled } from '@mui/material';

const PO_MSGCTXT_KEY_SEPARATOR = '\u0004';

const ScWrapper = styled('span')`
  display: inline;
`;

const ScMsgctxt = styled('span')`
  display: inline-flex;
  vertical-align: text-top;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  border: 1px solid #bbc2cb;
  background-color: #f0f2f4;
  color: #4d5b6e;
  border-radius: 10px;
  padding: 0px 7px;
  font-size: 12px;
  user-select: none;
  margin: 0px 4px 0px 1px;
  overflow: hidden;
  font-family: monospace;
`;

type Props = {
  name: string;
};

export const KeyName: React.FC<Props> = ({ name }) => {
  const idx = name.indexOf(PO_MSGCTXT_KEY_SEPARATOR);
  if (idx <= 0) {
    return <ScWrapper>{name.replace(PO_MSGCTXT_KEY_SEPARATOR, '')}</ScWrapper>;
  }
  return (
    <ScWrapper>
      <ScMsgctxt>{name.slice(0, idx)}</ScMsgctxt>
      {name.slice(idx + 1)}
    </ScWrapper>
  );
};
