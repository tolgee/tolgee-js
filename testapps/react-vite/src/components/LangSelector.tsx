import React from 'react';
import { useSetLanguage, useCurrentLanguage } from '@tolgee/react';

export const LangSelector: React.FC = () => {
  const setLanguage = useSetLanguage();
  const getLang = useCurrentLanguage();

  return (
    <select
      className="lang-selector"
      onChange={(e) => setLanguage(e.target.value)}
      value={getLang()}
    >
      <option value="en">🇬🇧 English</option>
      <option value="cs">🇨🇿 Česky</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  );
};
