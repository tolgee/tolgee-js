import { GeneralObserver } from './GeneralObserver';
import { InvisibleWrapper } from './invisible/InvisibleWrapper';

export const InvisibleObserver = () => {
  const wrapper = InvisibleWrapper();
  return GeneralObserver(wrapper);
};
