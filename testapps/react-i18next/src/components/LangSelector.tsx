import React, { useEffect, useState } from 'react';
import i18next from '../i18next';

export const LangSelector: React.FC = () => {
  const [currentLang, setCurrentLang] = useState(i18next.language);
  useEffect(() => {
    const listener = (lang: string) => {
      setCurrentLang(lang);
    };
    i18next.on('languageChanged', listener);
    () => i18next.off('languageChanged', listener);
  }, []);

  return (
    <select
      className="lang-selector"
      onChange={(e) => i18next.changeLanguage(e.target.value)}
      value={currentLang}
    >
      <option value="en">🇬🇧 English</option>
      <option value="cs">🇨🇿 Česky</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  );
};
