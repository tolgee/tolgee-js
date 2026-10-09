import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { detectExtension, openPlugin } from '../../../tools/extension';
import { CHROME_EXTENSION_LINK } from '../../../constants';

export function OpenExtension() {
  const [present, setPresent] = useState<boolean>();
  useEffect(() => {
    let mounted = true;
    detectExtension().then((found) => mounted && setPresent(found));
    return () => {
      mounted = false;
    };
  }, []);
  if (present === undefined) {
    return null;
  }
  return (
    <Box mt={1.5}>
      {present ? (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          onClick={openPlugin}
        >
          Open the Tolgee plugin
        </Button>
      ) : (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          href={CHROME_EXTENSION_LINK}
          target="_blank"
          rel="noreferrer"
        >
          Install the Tolgee plugin
        </Button>
      )}
    </Box>
  );
}
