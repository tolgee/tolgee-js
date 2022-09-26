import React from 'react';
import { useTolgee } from '@tolgee/react';
import { changeLocale } from 'gatsby-plugin-react-intl';

export const LangSelector: React.FC = () => {
  const tolgee = useTolgee(['language']);

  return (
    <select
      className="lang-selector"
      onChange={(e) => changeLocale(e.target.value)}
      value={tolgee.getLanguage()}
    >
      <option value="en">🇬🇧 English</option>
      <option value="cs">🇨🇿 Česky</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  );
};
