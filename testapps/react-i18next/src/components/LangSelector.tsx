import React from 'react';
import { useTranslation } from 'react-i18next';

export const LangSelector: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <select
      className="lang-selector"
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      value={i18n.language}
    >
      <option value="en">🇬🇧 English</option>
      <option value="cs">🇨🇿 Česky</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  );
};
