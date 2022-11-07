import React from 'react';
import { useTolgee } from '@tolgee/react';

export const LangSelector: React.FC = () => {
  const tolgee = useTolgee(['pendingLanguage']);

  return (
    <select
      className="lang-selector"
      onChange={(e) => tolgee.changeLanguage(e.target.value)}
      value={tolgee.getPendingLanguage()}
    >
      <option value="en">🇬🇧 English</option>
      <option value="cs">🇨🇿 Česky</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
    </select>
  );
};
