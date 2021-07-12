import { useSetLanguage, useCurrentLanguage } from '@tolgee/react';
import React, { FunctionComponent } from 'react';

export const ChooseLanguage: FunctionComponent<React.ComponentProps<'select'>> =
  (props) => {
    const setLanguage = useSetLanguage();
    const getLang = useCurrentLanguage();

    return (
      <select
        {...props}
        style={{
          padding: '10px',
          borderRadius: '5px',
        }}
        onChange={(e) => setLanguage(e.target.value)}
        value={getLang()}
      >
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    );
  };
