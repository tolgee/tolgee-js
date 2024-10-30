'use client';

import React, { ChangeEvent } from 'react';
import { useTolgee } from '@tolgee/react';
import { setLanguage } from '@/tolgee/language';

export const LangSelector: React.FC = () => {
  const tolgee = useTolgee(['language']);
  const locale = tolgee.getLanguage();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    setLanguage(nextLocale);
  }
  return (
    <select className="lang-selector" onChange={onSelectChange} value={locale}>
      <option value="en">English</option>
      <option value="cs">Česky</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  );
};
