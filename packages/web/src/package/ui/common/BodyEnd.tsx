import { createPortal } from 'react-dom';
import { getRootElement } from '../getRootElement';

type Props = {
  children: React.ReactNode;
};

export const DevToolsPortal = ({ children }: Props) => {
  return createPortal(children, getRootElement());
};
