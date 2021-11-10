import React from 'react';
import { useCurrentLanguage } from '@tolgee/react';
import { changeLocale } from 'gatsby-plugin-intl';

export const LangSelector: React.FC = () => {
  const getLang = useCurrentLanguage();

  return (
    <select
      className="lang-selector"
      onChange={(e) => changeLocale(e.target.value)}
      value={getLang()}
    >
      <option value="en">🇬🇧 English</option>
      <option value="cs">🇨🇿 Česky</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  );
};
