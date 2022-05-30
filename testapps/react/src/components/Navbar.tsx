import { LangSelector } from './LangSelector';

type Props = {
  children?: React.ReactNode;
};

export const Navbar: React.FC<Props> = ({ children }) => {
  return (
    <div className="navbar">
      {children}
      <LangSelector />
    </div>
  );
};
